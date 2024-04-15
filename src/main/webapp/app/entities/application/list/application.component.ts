import { Component, OnInit } from '@angular/core';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Data, ParamMap, Router } from '@angular/router';
import { combineLatest, filter, map, Observable, switchMap, tap } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IApplication } from '../application.model';

import { ITEMS_PER_PAGE, PAGE_HEADER, TOTAL_COUNT_RESPONSE_HEADER } from 'app/config/pagination.constants';
import { ASC, DESC, SORT, ITEM_DELETED_EVENT, DEFAULT_SORT_DATA } from 'app/config/navigation.constants';
import { EntityArrayResponseType, ApplicationService } from '../service/application.service';
import { ApplicationDeleteDialogComponent } from '../delete/application-delete-dialog.component';
import { DataUtils } from 'app/core/util/data-util.service';
import { IVolunteerPost } from 'app/entities/volunteer-post/volunteer-post.model';
import { AccountService } from 'app/core/auth/account.service';
import { VolunteerPostService } from 'app/entities/volunteer-post/service/volunteer-post.service';
import { ApplicationStatus } from 'app/entities/enumerations/application-status.model';

@Component({
  selector: 'jhi-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit {
  selectedPost = 'ALL';
  volunteerPostsList: IVolunteerPost[] = [];
  shopId: number | null = null;
  customerId: number | null = null;
  applications?: IApplication[];
  isLoading = false;

  predicate = 'id';
  ascending = true;

  itemsPerPage = ITEMS_PER_PAGE;
  totalItems = 0;
  page = 1;

  constructor(
    protected applicationService: ApplicationService,
    protected activatedRoute: ActivatedRoute,
    public router: Router,
    protected dataUtils: DataUtils,
    protected modalService: NgbModal,
    protected accountService: AccountService,
    protected volunteerPostService: VolunteerPostService
  ) {}

  trackId = (_index: number, item: IApplication): number => this.applicationService.getApplicationIdentifier(item);

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.accountService.getShop().subscribe(shop => {
          // Check if shop is not null or undefined
          if (shop) {
            // Print the shop's ID
            console.log('Shop ID: ', shop.id);
            this.shopId = shop.id;
          } else {
            console.log('Shop not found!!');
          }
        });

        this.accountService.getCustomer().subscribe(customer => {
          // Check if customer is not null or undefined
          if (customer) {
            // Print the customer's ID
            console.log('Customer ID: ', customer.id);
            this.customerId = customer.id;
          } else {
            console.log('Customer not found');
          }
        });
      }
    });
    this.loadRelationshipsOptions();
    this.load();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    return this.dataUtils.openFile(base64String, contentType);
  }

  delete(event: Event, application: IApplication): void {
    event.stopPropagation();
    const modalRef = this.modalService.open(ApplicationDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.application = application;
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
    const page = params.get(PAGE_HEADER);
    this.page = +(page ?? 1);
    const sort = (params.get(SORT) ?? data[DEFAULT_SORT_DATA]).split(',');
    this.predicate = sort[0];
    this.ascending = sort[1] === ASC;
  }

  protected onResponseSuccess(response: EntityArrayResponseType): void {
    this.fillComponentAttributesFromResponseHeader(response.headers);
    const dataFromBody = this.fillComponentAttributesFromResponseBody(response.body);
    this.applications = dataFromBody;
  }

  protected fillComponentAttributesFromResponseBody(data: IApplication[] | null): IApplication[] {
    return data ?? [];
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
    return this.applicationService.query(queryObject).pipe(tap(() => (this.isLoading = false)));
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

  protected loadRelationshipsOptions(): void {
    this.volunteerPostService
      .query()
      .pipe(map((res: HttpResponse<IVolunteerPost[]>) => res.body ?? []))
      .pipe(
        map((volunteerPosts: IVolunteerPost[]) =>
          this.volunteerPostService.addVolunteerPostToCollectionIfMissing<IVolunteerPost>(volunteerPosts)
        )
      )
      .subscribe((volunteerPosts: IVolunteerPost[]) => (this.volunteerPostsList = volunteerPosts));
  }

  protected checkPost(id: number | undefined): boolean {
    return id == this.shopId;
  }

  acceptApplication(event: Event, application: IApplication): void {
    event.stopPropagation();
    application.applicationStatus = ApplicationStatus.ACCEPTED;
    this.applicationService.update(application).subscribe(
      () => {},
      error => {
        console.log('Failed to update application status.');
      }
    );
  }

  rejectApplication(event: Event, application: IApplication): void {
    event.stopPropagation();
    application.applicationStatus = ApplicationStatus.REJECTED;
    this.applicationService.update(application).subscribe(
      () => {},
      error => {
        console.log('Failed to update application status.');
      }
    );
  }

  pendingApplication(event: Event, application: IApplication): void {
    event.stopPropagation();
    application.applicationStatus = ApplicationStatus.PENDING;
    this.applicationService.update(application).subscribe(
      () => {},
      error => {
        console.log('Failed to update application status.');
      }
    );
  }
}
