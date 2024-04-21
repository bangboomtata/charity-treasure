import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IShop } from '../shop.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { CustomerEmailsService } from 'app/entities/customer-emails/service/customer-emails.service';
import { NewCustomerEmails } from 'app/entities/customer-emails/customer-emails.model';

@Component({
  selector: 'jhi-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss'],
})
export class ShopDetailComponent implements OnInit {
  shop: IShop | null = null;
  customer: boolean = true;
  customerID: number | null = null;
  showModal = false;
  subscribeSuccess = false;
  alreadySub = false;
  showunsub = false;
  deletedSuccessfully = false;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    private accountService: AccountService,
    private customerEmailsService: CustomerEmailsService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ shop }) => {
      this.shop = shop;
      this.isShop().subscribe(isShop => {
        if (isShop) {
          this.customer = false;
        } else {
          this.customer = true;
        }
      });
      if (this.customer === true) {
        this.accountService.getCustomer().subscribe(customer => {
          if (customer) {
            this.customerID = customer.id;
          }
        });
        if (this.shop !== null) {
          if (this.shop.shopEmail !== null && this.shop.shopEmail !== undefined) {
            this.customerEmailsService.ifEmailExists(this.shop.shopEmail).subscribe({
              next: response => {
                for (let i = 0; i < response.length; i++) {
                  // @ts-ignore
                  if (response[i].customer !== null && response[i].customer !== undefined && response[i].customer.id === this.customerID) {
                    this.alreadySub = true;
                  }
                }
              },
              error: err => console.error('Error fetching ID by email:', err),
            });
          }
        }
      }
    });
  }

  isShop(): Observable<boolean> {
    return this.accountService.getShop().pipe(map(shop => shop !== null));
  }

  showSubscribe() {
    this.showModal = true;
    this.subscribeSuccess = false;
  }

  closeSubscribe() {
    this.showModal = false;
    this.showunsub = false;
  }

  showUn() {
    this.showunsub = true;
  }

  unsub() {
    if (this.shop && this.shop.shopEmail) {
      this.customerEmailsService.getIdByEmail(this.shop.shopEmail).subscribe({
        next: response => {
          if (response.length > 1) {
            // Handle the case where multiple IDs are returned
            console.log('Multiple customer IDs found, need user input or additional handling');
          } else if (response.length === 1) {
            this.customerEmailsService.delete(response[0]).subscribe({
              next: () => (this.deletedSuccessfully = true),
              error: err => console.error('Error during deletion:', err),
            });
          } else {
            console.log('No customer found with that email');
          }
        },
        error: err => console.error('Error fetching ID by email:', err),
      });
    }
  }

  subscribeFeature() {
    if (this.customer) {
      this.accountService.getCustomer().subscribe(customer => {
        if (customer && this.shop !== null) {
          const shopEmail = this.shop.shopEmail;
          const customerEmail: NewCustomerEmails = {
            id: null,
            email: shopEmail,
            customer: customer,
          };
          if (shopEmail) {
            if (!this.alreadySub) {
              this.customerEmailsService.create(customerEmail).subscribe(customerEmail => {
                if (customerEmail !== null) {
                  this.subscribeSuccess = true;
                  this.alreadySub = true;
                }
              });
            }
          }
        }
      });
    }
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

  protected readonly close = close;
}
