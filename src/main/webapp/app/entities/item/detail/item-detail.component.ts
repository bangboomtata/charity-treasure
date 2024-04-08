import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { IItem } from '../item.model';
import { DataUtils } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.scss'],
})
export class ItemDetailComponent implements OnInit {
  item: IItem | null = null;
  editable: boolean = false;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, private accountService: AccountService) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ item }) => {
      this.item = item;
      if (this.getShopID() === true) {
        this.editable = true;
      }
    });
  }

  getShopID(): boolean {
    this.accountService.getShop().subscribe(shop => {
      if (shop !== null) {
        if (this.item !== null && shop.id === this.item.id) {
          return true;
        }
      }
      return false;
    });
    return false;
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
