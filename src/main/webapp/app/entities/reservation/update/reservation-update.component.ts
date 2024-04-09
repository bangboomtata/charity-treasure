import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ReservationFormService, ReservationFormGroup } from './reservation-form.service';
import { IReservation } from '../reservation.model';
import { ReservationService } from '../service/reservation.service';
import { IItem } from 'app/entities/item/item.model';
import { ItemService } from 'app/entities/item/service/item.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { ReservationStatus } from 'app/entities/enumerations/reservation-status.model';

//my imports
import dayjs from 'dayjs';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-reservation-update',
  templateUrl: './reservation-update.component.html',
  styleUrls: ['./reservation-form.component.scss'],
})
export class ReservationUpdateComponent implements OnInit {
  isSaving = false;
  reservation: IReservation | null = null;
  reservationStatusValues = Object.keys(ReservationStatus);

  itemsCollection: IItem[] = [];
  customersSharedCollection: ICustomer[] = [];
  shopsSharedCollection: IShop[] = [];

  editForm: ReservationFormGroup = this.reservationFormService.createReservationFormGroup();

  constructor(
    protected reservationService: ReservationService,
    protected reservationFormService: ReservationFormService,
    protected itemService: ItemService,
    protected customerService: CustomerService,
    protected shopService: ShopService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router
  ) {}
  navigateToConfirmation() {
    this.router.navigate(['/reservation/confirmation']);
  }

  compareItem = (o1: IItem | null, o2: IItem | null): boolean => this.itemService.compareItem(o1, o2);

  compareCustomer = (o1: ICustomer | null, o2: ICustomer | null): boolean => this.customerService.compareCustomer(o1, o2);

  compareShop = (o1: IShop | null, o2: IShop | null): boolean => this.shopService.compareShop(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservation }) => {
      this.reservation = reservation;
      if (reservation) {
        this.updateForm(reservation);
      } else {
        // New reservation - set default dates
        this.setReservationDates();
      }
      this.loadRelationshipsOptions();
    });
  }

  private setReservationDates(): void {
    const currentDay = dayjs().format('YYYY-MM-DDTHH:mm');
    const twoDaysLater = dayjs().add(2, 'day').format('YYYY-MM-DDTHH:mm');
    this.editForm.patchValue({
      reservedTime: currentDay,
      reservedExpiry: twoDaysLater,
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reservation = this.reservationFormService.getReservation(this.editForm);
    if (reservation.id !== null) {
      this.subscribeToSaveResponse(this.reservationService.update(reservation));
    } else {
      this.subscribeToSaveResponse(this.reservationService.create(reservation));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReservation>>): void {
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

  protected updateForm(reservation: IReservation): void {
    this.reservation = reservation;
    this.reservationFormService.resetForm(this.editForm, reservation);
    // Now, add or update the form control for the customer's full name
    // If the 'customerFullName' field is already part of the form, update its value

    this.itemsCollection = this.itemService.addItemToCollectionIfMissing<IItem>(this.itemsCollection, reservation.item);
    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing<ICustomer>(
      this.customersSharedCollection,
      reservation.customer
    );
    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing<IShop>(this.shopsSharedCollection, reservation.shop);

    if (!reservation.id) {
      // New reservation - set default dates
      this.setReservationDates();
    }
  }

  protected loadRelationshipsOptions(): void {
    this.itemService
      .query({ filter: 'reservedby-is-null' })
      .pipe(map((res: HttpResponse<IItem[]>) => res.body ?? []))
      .pipe(map((items: IItem[]) => this.itemService.addItemToCollectionIfMissing<IItem>(items, this.reservation?.item)))
      .subscribe((items: IItem[]) => (this.itemsCollection = items));

    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing<ICustomer>(customers, this.reservation?.customer)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));

    this.shopService
      .query()
      .pipe(map((res: HttpResponse<IShop[]>) => res.body ?? []))
      .pipe(map((shops: IShop[]) => this.shopService.addShopToCollectionIfMissing<IShop>(shops, this.reservation?.shop)))
      .subscribe((shops: IShop[]) => (this.shopsSharedCollection = shops));
  }
}
