import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CustomerEmailsFormService, CustomerEmailsFormGroup } from './customer-emails-form.service';
import { ICustomerEmails } from '../customer-emails.model';
import { CustomerEmailsService } from '../service/customer-emails.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

@Component({
  selector: 'jhi-customer-emails-update',
  templateUrl: './customer-emails-update.component.html',
})
export class CustomerEmailsUpdateComponent implements OnInit {
  isSaving = false;
  customerEmails: ICustomerEmails | null = null;

  customersSharedCollection: ICustomer[] = [];

  editForm: CustomerEmailsFormGroup = this.customerEmailsFormService.createCustomerEmailsFormGroup();

  constructor(
    protected customerEmailsService: CustomerEmailsService,
    protected customerEmailsFormService: CustomerEmailsFormService,
    protected customerService: CustomerService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCustomer = (o1: ICustomer | null, o2: ICustomer | null): boolean => this.customerService.compareCustomer(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ customerEmails }) => {
      this.customerEmails = customerEmails;
      if (customerEmails) {
        this.updateForm(customerEmails);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const customerEmails = this.customerEmailsFormService.getCustomerEmails(this.editForm);
    if (customerEmails.id !== null) {
      this.subscribeToSaveResponse(this.customerEmailsService.update(customerEmails));
    } else {
      this.subscribeToSaveResponse(this.customerEmailsService.create(customerEmails));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICustomerEmails>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(customerEmails: ICustomerEmails): void {
    this.customerEmails = customerEmails;
    this.customerEmailsFormService.resetForm(this.editForm, customerEmails);

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing<ICustomer>(
      this.customersSharedCollection,
      customerEmails.customer
    );
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing<ICustomer>(customers, this.customerEmails?.customer)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));
  }
}
