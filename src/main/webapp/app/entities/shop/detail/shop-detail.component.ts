import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { IShop } from '../shop.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss'],
})
export class ShopDetailComponent implements OnInit {
  shop: IShop | null = null;
  customer: boolean = true;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, private accountService: AccountService) {}

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
    });
  }

  isShop(): Observable<boolean> {
    return this.accountService.getShop().pipe(map(shop => shop !== null));
  }

  subscribe() {
    if (this.customer) {
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
}
