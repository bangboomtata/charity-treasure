import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IReservation } from '../reservation.model';
import { HttpResponse } from '@angular/common/http';
import { IItem } from '../../item/item.model';
import { ItemService } from '../../item/service/item.service';
import { CustomerService } from '../../customer/service/customer.service';
import { ShopService } from '../../shop/service/shop.service';

import { ICustomer } from 'app/entities/customer/customer.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ReservationStatus } from 'app/entities/enumerations/reservation-status.model';
import { identity } from 'rxjs';

@Component({
  selector: 'jhi-reservation-detail',
  templateUrl: './reservation-detail.component.html',
})
export class ReservationDetailComponent implements OnInit {
  reservation: IReservation | null = null;

  itemId: number | null = null;
  itemName: string | null | undefined = null;
  shopName: string | null | undefined = null;
  customerName: string | null | undefined = null;

  itemAvailability: boolean | null | undefined = undefined;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected itemService: ItemService,
    protected customerService: CustomerService,
    protected shopService: ShopService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reservation }) => {
      this.reservation = reservation;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
