import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';
import { Validators, FormControl } from '@angular/forms';

import { ApplicationFormService, ApplicationFormGroup } from './application-form.service';
import { IApplication } from '../application.model';
import { ApplicationService } from '../service/application.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IVolunteerPost } from 'app/entities/volunteer-post/volunteer-post.model';
import { VolunteerPostService } from 'app/entities/volunteer-post/service/volunteer-post.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { ApplicationStatus } from 'app/entities/enumerations/application-status.model';
import { AccountService } from 'app/core/auth/account.service';
import dayjs from 'dayjs/esm';

@Component({
  selector: 'jhi-application-update',
  templateUrl: './application-update.component.html',
  styleUrls: ['./application-form.scss'],
})
export class ApplicationUpdateComponent implements OnInit {
  mondayNeeded: boolean | undefined;
  tuesdayNeeded: boolean | undefined;
  wednesdayNeeded: boolean | undefined;
  thursdayNeeded: boolean | undefined;
  fridayNeeded: boolean | undefined;
  saturdayNeeded: boolean | undefined;
  sundayNeeded: boolean | undefined;

  morningNeeded: boolean | undefined;
  afternoonNeeded: boolean | undefined;
  eveningNeeded: boolean | undefined;

  customerId: number | undefined;
  postId: number | undefined;
  postTitle: string | null | undefined;

  termsAccepted = false;

  isSaving = false;
  application: IApplication | null = null;
  applicationStatusValues = Object.keys(ApplicationStatus);

  volunteerPostsSharedCollection: IVolunteerPost[] = [];
  customersSharedCollection: ICustomer[] = [];

  editForm: ApplicationFormGroup = this.applicationFormService.createApplicationFormGroup();
  emailControl: FormControl = new FormControl('', [Validators.required, Validators.email]); // FormControl for email with validators
  //phoneControl: FormControl = new FormControl('', [Validators.required, Validators.pattern(/^\d{10}$/)]); // FormControl for phone with validators

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected applicationService: ApplicationService,
    protected applicationFormService: ApplicationFormService,
    protected volunteerPostService: VolunteerPostService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute,
    protected accountService: AccountService,
    protected router: Router
  ) {}

  clickedTerms(): void {
    // Implement logic to check if the terms checkbox is checked
    const checkbox = document.getElementById('termsCheckbox') as HTMLInputElement;

    if (checkbox.checked) {
      this.termsAccepted = true;
    } else {
      this.termsAccepted = false;
    }
  }

  compareVolunteerPost = (o1: IVolunteerPost | null, o2: IVolunteerPost | null): boolean =>
    this.volunteerPostService.compareVolunteerPost(o1, o2);

  compareCustomer = (o1: ICustomer | null, o2: ICustomer | null): boolean => this.customerService.compareCustomer(o1, o2);

  get isMondayNeeded(): boolean {
    return !!this.mondayNeeded;
  }

  get isTuesdayNeeded(): boolean {
    return !!this.tuesdayNeeded;
  }

  get isWednesdayNeeded(): boolean {
    return !!this.wednesdayNeeded;
  }

  get isThursdayNeeded(): boolean {
    return !!this.thursdayNeeded;
  }

  get isFridayNeeded(): boolean {
    return !!this.fridayNeeded;
  }

  get isSaturdayNeeded(): boolean {
    return !!this.saturdayNeeded;
  }

  get isSundayNeeded(): boolean {
    return !!this.sundayNeeded;
  }

  get isMorningNeeded(): boolean {
    return !!this.morningNeeded;
  }

  get isAfternoonNeeded(): boolean {
    return !!this.afternoonNeeded;
  }

  get isEveningNeeded(): boolean {
    return !!this.eveningNeeded;
  }

  ngOnInit(): void {
    //set default value
    this.editForm.patchValue({
      applicationDate: dayjs(), // Set default to current date
      applicationStatus: ApplicationStatus.PENDING, // Set default to pending
    });

    //get details of current logged in user
    this.accountService.identity().subscribe(account => {
      if (account) {
        //get customer based on user id
        this.accountService.getCustomer().subscribe(customer => {
          if (customer) {
            this.customerId = customer.id;
            // console.log('Customer ID: ', customer.id);

            const castedCustomer = customer
              ? {
                  id: customer.id,
                }
              : null;

            //set default value of customer
            this.editForm.patchValue({
              customer: castedCustomer,
            });
          }
        });
      }
    });

    //get the volunteer post that this application is applying
    this.activatedRoute.queryParams.subscribe(params => {
      const volunteerPostId = params['volunteerPostId'];
      this.postId = volunteerPostId;

      if (this.postId) {
        this.volunteerPostService.findById(this.postId).subscribe(volunteerPost => {
          if (volunteerPost) {
            this.postTitle = volunteerPost?.postTitle;

            this.mondayNeeded = !!volunteerPost.monday;
            this.tuesdayNeeded = !!volunteerPost.tuesday;
            this.wednesdayNeeded = !!volunteerPost.wednesday;
            this.thursdayNeeded = !!volunteerPost.thursday;
            this.fridayNeeded = !!volunteerPost.friday;
            this.saturdayNeeded = !!volunteerPost.saturday;
            this.sundayNeeded = !!volunteerPost.sunday;

            this.morningNeeded = !!volunteerPost.morning;
            this.afternoonNeeded = !!volunteerPost.afternoon;
            this.eveningNeeded = !!volunteerPost.evening;
          }
        });

        const castedPost = volunteerPostId
          ? {
              id: volunteerPostId,
            }
          : null;

        //make the default value of post to the volunteer post that this application is applying
        this.editForm.patchValue({
          post: castedPost,
        });

        //console.log('POST ID: ' + this.postId);
      }
    });

    this.activatedRoute.data.subscribe(({ application }) => {
      this.application = application;
      if (application) {
        this.updateForm(application);
      }

      this.loadRelationshipsOptions();
    });
  }

  autoFillPost(volunteerID: number): boolean {
    //console.log(volunteerID + ": " + (volunteerID.toString() == this.postId?.toString()));
    return volunteerID.toString() == this.postId?.toString();
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const application = this.applicationFormService.getApplication(this.editForm);
    if (application.id !== null) {
      this.subscribeToSaveResponse(this.applicationService.update(application));
    } else {
      this.subscribeToSaveResponse(this.applicationService.create(application));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IApplication>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.router.navigate(['/application-success']);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(application: IApplication): void {
    this.application = application;
    this.applicationFormService.resetForm(this.editForm, application);

    this.volunteerPostsSharedCollection = this.volunteerPostService.addVolunteerPostToCollectionIfMissing<IVolunteerPost>(
      this.volunteerPostsSharedCollection,
      application.post
    );
    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing<ICustomer>(
      this.customersSharedCollection,
      application.customer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.volunteerPostService
      .query()
      .pipe(map((res: HttpResponse<IVolunteerPost[]>) => res.body ?? []))
      .pipe(
        map((volunteerPosts: IVolunteerPost[]) =>
          this.volunteerPostService.addVolunteerPostToCollectionIfMissing<IVolunteerPost>(volunteerPosts, this.application?.post)
        )
      )
      .subscribe((volunteerPosts: IVolunteerPost[]) => (this.volunteerPostsSharedCollection = volunteerPosts));

    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing<ICustomer>(customers, this.application?.customer)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }
}
