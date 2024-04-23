import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { IItem } from '../item.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { Account } from 'app/core/auth/account.model';

@Component({
  selector: 'jhi-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  item: IItem | null = null;
  editable: boolean = false;
  Shop: boolean = true;
  currentCustomerId: number | null = null;
  currentAccount: Account | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.currentAccount = account;
      }
    });

    this.activatedRoute.data.subscribe(({ item }) => {
      this.item = item;
      this.getShopID().subscribe(isEditable => {
        if (isEditable) {
          this.editable = true;
        } else {
          this.editable = false;
        }
      });
      this.isShop().subscribe(isShop => {
        if (isShop) {
          this.Shop = true;
        } else {
          this.Shop = false;
        }
      });
      console.log(this.editable);
    });

    this.accountService.getCustomer().subscribe(customer => {
      if (customer) {
        console.log('Customer ID: ' + customer.id);
        this.currentCustomerId = customer.id;
        this.editable = false;
      }
    });
  }

  isShop(): Observable<boolean> {
    return this.accountService.getShop().pipe(map(shop => shop !== null));
  }

  getShopID(): Observable<boolean> {
    if (!this.item || !this.item.shop) {
      return of(false);
    }
    const itemId = this.item.shop.id!;
    return this.accountService.getShop().pipe(
      map(shop => {
        return shop !== null && shop.id === itemId;
      })
    );
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
