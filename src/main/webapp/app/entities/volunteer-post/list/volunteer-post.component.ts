import { Component, OnInit } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IVolunteerPost } from '../volunteer-post.model';
import { AccountService } from 'app/core/auth/account.service';
import { FontSizeService } from 'app/font-size/font-size.service';

import { ITEMS_PER_PAGE } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, VolunteerPostService } from '../service/volunteer-post.service';
import { VolunteerPostDeleteDialogComponent } from '../delete/volunteer-post-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { ParseLinks } from 'app/core/util/parse-links.service';

@Component({
  selector: 'jhi-volunteer-post',
  templateUrl: './volunteer-post.component.html',
  styleUrls: ['./volunteer.component.scss'],
})
export class VolunteerPostComponent implements OnInit {
  shopID: number | null = null;
  customerID: number | null = null;
  volunteerPosts?: IVolunteerPost[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  links: { [key: string]: number } = {
    last: 0,
  };
  page = 1;

  selectedPost: IVolunteerPost | null = null;

  constructor(
    protected volunteerPostService: VolunteerPostService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected parseLinks: ParseLinks,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected fontSizeService: FontSizeService
  ) {}

  selectPost(post: IVolunteerPost): void {
    this.fontSizeService.adjustFontSize();
    this.selectedPost = post;
  }

  isSelected(post: IVolunteerPost): boolean {
    return this.selectedPost === post;
  }

  scrollToElement(elementId: string): void {
    const element = document.getElementById(elementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  reset(): void {
    this.page = 1;
    this.volunteerPosts = [];
    this.load();
  }

  loadPage(page: number): void {
    this.page = page;
    this.load();
  }

  trackId = (_index: number, item: IVolunteerPost): number => this.volunteerPostService.getVolunteerPostIdentifier(item);

  ngAfterViewChecked() {
    // Call the font adjustment function after view checked
    this.fontSizeService.adjustFontSize();
  }

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.accountService.getShop().subscribe(shop => {
          // Check if shop is not null or undefined
          if (shop) {
            // Print the shop's ID
            console.log('Shop ID: ', shop.id);
            this.shopID = shop.id;
          } else {
            console.log('Shop not found');
          }
        });
      }

      this.accountService.getCustomer().subscribe(customer => {
        // Check if customer is not null or undefined
        if (customer) {
          // Print the customer's ID
          console.log('Customer ID: ', customer.id);
          this.customerID = customer.id;
        } else {
          console.log('Customer not found');
        }
      });
    });
    this.load();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(event: Event, volunteerPost: IVolunteerPost): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(VolunteerPostDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.volunteerPost = volunteerPost;
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
  }

  navigateToWithComponentValues(): void {
    this.handleNavigation(this.page, this.predicate, this.ascending);
  }

  navigateToPage(page = this.page): void {
    this.handleNavigation(page, this.predicate, this.ascending);
  }

  protected loadFromBackendWithRouteInformations(): Observable<EntityArrayResponseType> {
    return combineLatest([this.activatedRoute.queryParamMap, this.activatedRoute.data]).pipe(
      tap(([params, data]) => this.fillComponentAttributeFromRoute(params, data)),
      switchMap(() => this.queryBackend(this.page, this.predicate, this.ascending))
    );
  }

  protected fillComponentAttributeFromRoute(params: ParamMap, data: Data): void {
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.volunteerPosts = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IVolunteerPost[] | null): IVolunteerPost[] {
    // const volunteerPostsNew = this.volunteerPosts ?? [];
    // if (data) {
    //   for (const d of data) {
    //     if (volunteerPostsNew.map(op => op.id).indexOf(d.id) === -1) {
    //       volunteerPostsNew.push(d);
    //     }
    //   }
    // }
    // return volunteerPostsNew;
    return data ?? [];
  }

  protected fillComponentAttributesFromResponseHeader(headers: HttpHeaders): void {
    const linkHeader = headers.get('link');
    if (linkHeader) {
      this.links = this.parseLinks.parse(linkHeader);
    } else {
      this.links = {
        last: 0,
      };
    }
  }

  protected queryBackend(page?: number, predicate?: string, ascending?: boolean): Observable<EntityArrayResponseType> {
    this.isLoading = true;
    const pageToLoad: number = page ?? 1;
    const queryObject = {
      page: pageToLoad - 1,
      size: this.itemsPerPage,
      sort: this.getSortQueryParam(predicate, ascending),
    };
    return this.volunteerPostService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  protected editVolunteerPost(event: Event, volunteerPost: any) {
    event.stopPropagation(); // Stop the click event from propagating
    this.router.navigate(['/volunteer-post', volunteerPost.id, 'edit']);
  }

  protected applyVolunteer(volunteerPost: any) {
    this.router.navigate(['/application', 'new'], {
      queryParams: { volunteerPostId: volunteerPost.id, volunteerPostTitle: volunteerPost.postTitle },
    });
  }
}
