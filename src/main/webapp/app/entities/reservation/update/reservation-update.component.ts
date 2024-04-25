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
import { HttpClient } from '@angular/common/http';
import { Validators } from '@angular/forms';

import { AccountService } from '../../../core/auth/account.service';

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
  showPopup = false;

  itemId: number | null = null;
  itemName: string | null | undefined = null;
  shopName: string | null | undefined = null;
  itemImage: string | null | undefined = null;
  itemImageContentType: string | null | undefined = null;
  price: number | null | undefined = null;
  itemAvailability: boolean | null | undefined = undefined;

  item: IItem | null | undefined = null;
  customer: ICustomer | null = null;
  shop: IShop | null | undefined = null;
  shopId: number | null | undefined = null;

  isModalVisible = false; // Controls the visibility of the modal
  constructor(
    protected reservationService: ReservationService,
    protected reservationFormService: ReservationFormService,
    protected itemService: ItemService,
    protected customerService: CustomerService,
    protected shopService: ShopService,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    private http: HttpClient, // HttpClient is used to fetch item details
    protected accountService: AccountService
  ) {}

  navigateToConfirmation() {
    this.router.navigate(['/reservation/confirmation']);
  }

  compareItem = (o1: IItem | null, o2: IItem | null): boolean => this.itemService.compareItem(o1, o2);

  compareCustomer = (o1: ICustomer | null, o2: ICustomer | null): boolean => this.customerService.compareCustomer(o1, o2);

  compareShop = (o1: IShop | null, o2: IShop | null): boolean => this.shopService.compareShop(o1, o2);

  // confirmReservation() {
  //   // Assuming you have itemId and the new availability state ready
  //   if (this.itemId != null) {
  //     this.itemService.updateAvailability(this.itemId, false).subscribe({
  //       next: () => {
  //         console.log('Item availability updated successfully');
  //         // Update your UI accordingly here
  //       },
  //       error: error => console.error('There was an error updating the item availability', error)
  //     });
  //   }
  //   this.save();
  // }
  // Example component method
  // Assuming itemId is the ID of the item to update
  confirmReservation(): void {
    if (this.itemId === null) {
      console.error('Item ID is null');
      return;
    }

    // Step 1: Fetch the Item
    this.itemService.find(this.itemId).subscribe({
      next: response => {
        const item = response.body;
        if (!item) {
          console.error('Item not found');
          return;
        }

        // Step 2: Modify the Item's Availability
        item.itemAvailability = false;

        // Step 3: Update the Item
        this.itemService.update(item).subscribe({
          next: () => console.log('Item updated successfully'),
          error: error => console.error('Error updating item', error),
        });
      },
      error: error => console.error('Error fetching item', error),
    });
    this.hideModal();
    this.save();
  }

  ngOnInit(): void {
    this.editForm.statusChanges.subscribe(status => {
      console.log('Form valid?', this.editForm.valid);
      console.log('Errors:', this.editForm.errors);
      Object.keys(this.editForm.controls).forEach(key => {
        console.log(key, this.editForm.controls[key].errors);
      });
    });

    this.loadRelationshipsOptions();
    this.activatedRoute.params.subscribe(params => {
      this.itemId = +params['id']; // Convert to number
      if (this.itemId) {
        this.fetchItemDetails(this.itemId);
      }
      this.activatedRoute.data.subscribe(({ reservation }) => {
        this.reservation = reservation;

        if (reservation) {
          this.updateForm(reservation);
          // this.createForm(reservation);
        } else {
          // New reservation - set default dates
          this.setReservationDates();
          this.createForm();
        }
      });
    });

    this.accountService.identity().subscribe(account => {
      if (account) {
        this.accountService.getCustomer().subscribe(customer => {
          // Check if customer is not null or undefined
          if (customer) {
            // Print the customer's ID
            console.log('Customer ID: ', customer.id);
            this.customer = customer;
          } else {
            console.log('Customer not found');
          }
        });
      }
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

  createForm(reservation?: IReservation): void {
    // Common form initialization
    this.editForm = this.reservationFormService.createReservationFormGroup(reservation);

    if (!reservation) {
      // This is a new reservation, so set default dates
      const currentDay = dayjs().format('YYYY-MM-DDTHH:mm');
      const twoDaysLater = dayjs().add(2, 'day').format('YYYY-MM-DDTHH:mm');
      this.editForm.patchValue({
        reservedTime: currentDay,
        reservedExpiry: twoDaysLater,
      });
    }

    // Add validators if necessary
    this.editForm.get('customerFullName')?.setValidators([Validators.required, Validators.minLength(2)]);
    this.editForm.get('customerFullName')?.updateValueAndValidity();
  }

  fetchItemDetails(itemId: number): void {
    this.itemService.find(itemId).subscribe(
      (itemResponse: HttpResponse<IItem>) => {
        this.itemName = itemResponse.body?.itemName;

        this.shopName = itemResponse.body?.shop?.shopName;
        this.itemImage = itemResponse.body?.itemImage;
        this.itemImageContentType = itemResponse.body?.itemImageContentType;
        this.price = itemResponse.body?.price;
        this.itemAvailability = itemResponse.body?.itemAvailability;

        this.shop = itemResponse.body?.shop;
      },
      error => {
        console.error('Error fetching item details', error);
      }
    );
  }

  showModal(): void {
    this.isModalVisible = true; // Show the modal
  }

  hideModal(): void {
    this.isModalVisible = false; // Hide the modal
  }

  // confirmReservation(): void {
  //   // Place your reservation confirmation logic here
  //   console.log('Reservation confirmed');
  //   this.hideModal(); // Optionally close the modal after confirmation
  // }

  // confirmReservation(): void {
  //   // Assuming itemAvailability is part of your form data and you have a method to update it
  //   this.editForm.patchValue({this.itemAvailability: false});
  //   // Optionally, if itemAvailability needs to be updated via a service call, do that here
  //   // Example: this.itemService.updateItemAvailability(itemId, false).subscribe();
  //
  //   // Trigger any additional actions needed after confirming, like closing the modal
  //   this.hideModal();
  // }

  // saveAndConfirm(): void {
  //   if (this.editForm.valid && !this.isSaving) {
  //     // this.confirmReservation(); // This updates itemAvailability
  //     this.confirmReservation();
  //     this.save();
  //     // Then, call save method to submit the reservation form
  //     // this.setItemAvailabilityFalse();
  //
  //   }
  //   }

  // private setItemAvailabilityFalse(): void {
  //
  //   if (this.itemId) {
  //     this.itemService.updateItemAvailability(this.itemId, false).subscribe(() => {
  //       console.log('Item availability updated to false');
  //     });
  //   }
  // }

  // fetchShopDetails(shopId: number): void {
  //   // Use your shop service or http client to fetch shop details
  //   this.shopService.find(shopId).subscribe(
  //     (shopResponse: HttpResponse<IShop>) => {
  //       this.shopName = shopResponse.body?.shopName; // Update this based on your actual shop property
  //     },
  //     error => console.error('Error fetching shop details', error)
  //   );
  // }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    //this.editForm.patchValue({
    //  item: this.item
    // })

    const itemObj = this.itemId ? { id: this.itemId } : null;

    const reservation = this.reservationFormService.getReservation(this.editForm);
    reservation.status = ReservationStatus.CONFIRMED;
    reservation.item = itemObj;
    reservation.customer = this.customer;
    reservation.shop = this.shop;

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
    this.showThankYouPopup();
  }

  private showThankYouPopup(): void {
    // This can be an alert, a modal, or a simple div in your HTML that you make visible
    // alert('Thank you for your feedback!');
    this.showPopup = true;
    // setTimeout(() => {
    //   this.router.navigate(["/"]); // navigate to home after 5 seconds
    // }, 2500);
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(reservation: IReservation): void {
    // this.reservationFormService.resetForm(this.editForm, reservation);

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
