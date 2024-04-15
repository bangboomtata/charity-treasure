import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IVolunteerPost } from '../volunteer-post.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-volunteer-post-detail',
  templateUrl: './volunteer-post-detail.component.html',
  styleUrls: ['../list/volunteer.component.scss', './volunteer-detail.component.scss'],
})
export class VolunteerPostDetailComponent implements OnInit {
  volunteerPost: IVolunteerPost | null = null;
  shopID: number | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, protected accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.accountService.getShop().subscribe(shop => {
          // Check if shop is not null or undefined
          if (shop) {
            // Print the shop's ID
            console.log('Shop ID: ', shop.id);
            this.shopID = shop.id;
          } else {
            console.log('Shop not found');
          }
        });
      }
    });

    this.activatedRoute.data.subscribe(({ volunteerPost }) => {
      this.volunteerPost = volunteerPost;
    });
  }

  byteSize(base64String?: string | null): string {
    return this.dataUtils.byteSize(base64String ?? '');
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  previousState(): void {
    window.history.back();
  }
}
