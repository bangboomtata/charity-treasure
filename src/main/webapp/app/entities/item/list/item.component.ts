import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IItem } from '../item.model';
import { Account } from 'app/core/auth/account.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ItemService } from '../service/item.service';
import { ItemDeleteDialogComponent } from '../delete/item-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';
import { ItemType } from 'app/entities/enumerations/item-type.model';
import { subCategoryOptions } from '../item.model';
import { Gender } from 'app/entities/enumerations/gender.model';

@Component({
  selector: 'jhi-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  currentShopId: number | null = null;
  currentCustomerId: number | null = null;
  selectedCategory = 'ALL';
  items?: IItem[];
  currentSubCategories: string[] = [];
  isLoading = false;
  selectedOptions: string[] = [];
  isShop: boolean = false;
  currentAccount: Account | null = null;

  genderValues = Object.values(Gender);
  itemTypeValues = Object.values(ItemType);

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  constructor(
    protected itemService: ItemService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected accountService: AccountService
  ) {}

  trackId = (_index: number, item: IItem): number => this.itemService.getItemIdentifier(item);

  updateSelectedOptions(option: string) {
    // If option is already selected, remove it; otherwise, add it
    if (this.selectedOptions.includes(option)) {
      this.selectedOptions = this.selectedOptions.filter(item => item !== option);
      console.log('removed');
    } else {
      this.selectedOptions.push(option);
      console.log('added');
    }
  }

  shouldDisplayItem(item: IItem): boolean {
    console.log(this.selectedOptions);
    // Check if any options are selected
    if (this.selectedOptions.length === 0) {
      return true; // If no options are selected, display all items
    }

    // Check if the current item matches any of the selected options
    if (item && item.itemType && item.subCategory) {
      const itemTypeString = item.itemType.toString();
      const subCategoryString = item.subCategory.toString();
      if (item.itemType == ItemType.CLOTHING) {
        if (item.gender) {
          const genderString = item.gender.toString();
          if (
            this.selectedOptions.includes(itemTypeString) ||
            this.selectedOptions.includes(genderString) ||
            this.selectedOptions.includes(subCategoryString)
          ) {
            return true;
          }
        }
      }
      // Ensure that item properties are strings before comparison

      // Check if any selected option matches the current item
      if (this.selectedOptions.includes(itemTypeString) || this.selectedOptions.includes(subCategoryString)) {
        return true; // If any selected option matches the current item, display it
      }
    }

    return false; // If none of the selected options match the current item, do not display it
  }

  updateSubCategoryOptions(item: ItemType, gender: Gender | null): string[] | undefined {
    if (item === ItemType.CLOTHING && gender) {
      return subCategoryOptions[item][gender] || [];
    } else if (item && !(item in subCategoryOptions)) {
      return [];
    } else {
      return (subCategoryOptions[item] as string[]) || [];
    }
  }

  isClothing(itemType: ItemType) {
    console.log(itemType + ':' + itemType === ItemType.CLOTHING);
    return itemType === ItemType.CLOTHING;
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.currentAccount = account;
        this.accountService.getShop().subscribe(shop => {
          if (shop) {
            this.isShop = true;
            console.log('Shop ID: ', shop.id);
            this.currentShopId = shop.id;
          }
        });

        this.accountService.getCustomer().subscribe(customer => {
          if (customer) {
            console.log('Customer ID: ' + customer.id);
            this.currentCustomerId = customer.id;
          }
        });
      }
    });
    this.load();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(event: Event, item: IItem): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(ItemDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.item = item;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed
      .pipe(
        filter(reason => reason === ITEM_DELETED_EVENT),
        switchMap(() => this.loadFromBackendWithRouteInformations())
      )
      .subscribe({
        next: (res: EntityArrayResponseType) => {
          this.onResponseSuccess(res);
        },
      });
  }

  load(): void {
    this.loadFromBackendWithRouteInformations().subscribe({
      next: (res: EntityArrayResponseType) => {
        this.onResponseSuccess(res);
      },
    });
    if (this.items !== undefined) {
      this.checkAndUpdateItems();
    }
  }

  checkAndUpdateItems() {
    const currentTime = dayjs(); // Get the current time
    // @ts-ignore
    this.items.forEach(item => {
      if (item.saleFlag && item.saleEndTime && item.saleEndTime.isBefore(currentTime)) {
        // The sale has ended
        item.saleFlag = false; // Set saleFlag to false
        // @ts-ignore
        const parts = item.shownPrice.split(' ');
        item.shownPrice = parts[0];
        item.price = +parts[0];
        item.saleAmount = null;
        this.itemService.update(item); // Call the update function with this item
      }
    });
  }

  updateSaleFlags(items: IItem[]) {}

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected edit(event: Event, item: any) {
    event.stopPropagation();
    console.log('Cancelled');
    this.router.navigate(['/item', item.id, 'edit']);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.items = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IItem[] | null): IItem[] {
    return data ?? [];
  }

  getPriceParts(shownPrice: string | null | undefined): { originalPrice: string; discountedPrice: string; discountPercentage: string } {
    if (shownPrice === null || shownPrice === undefined) {
      return { originalPrice: '', discountedPrice: '', discountPercentage: '' }; // Handle null or undefined by returning empty parts
    }

    // Split the string by spaces to separate the parts
    const parts = shownPrice.split(' ');
    if (parts.length === 3) {
      return {
        originalPrice: parts[0],
        discountedPrice: parts[1],
        discountPercentage: parts[2],
      };
    }

    return { originalPrice: '', discountedPrice: '', discountPercentage: '' }; // Return empty parts if the format doesn't match
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    this.totalItems = Number(headers.get(TOTAL_COUNT_RESPONSE_HEADER));
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.itemService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
  }

  protected handleNavigation(page = this.page, predicate?: string, ascending?: boolean): void {
    const queryParamsObj = {
      page,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };

    this.router.navigate(['./'], {
      relativeTo: this.activatedRoute,
      queryParams: queryParamsObj,
    });
  }

  protected getSortQueryParam(predicate = this.predicate, ascending = this.ascending): string[] {
    const ascendingQueryParam = ascending ? ASC : DESC;
    if (predicate === '') {
      return [];
    } else {
      return [predicate + ',' + ascendingQueryParam];
    }
  }
}
