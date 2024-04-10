import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IApplication } from '../application.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { ApplicationStatus } from 'app/entities/enumerations/application-status.model';
import { ApplicationService } from '../service/application.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss'],
})
export class ApplicationDetailComponent implements OnInit {
  application: IApplication | null = null;
  shopId: number | null = null;
  customerId: number | null = null;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected applicationService: ApplicationService,
    protected accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.accountService.identity().subscribe(account => {
      if (account) {
        this.accountService.getShop().subscribe(shop => {
          // Check if shop is not null or undefined
          if (shop) {
            // Print the shop's ID
            console.log('Shop ID: ', shop.id);
            this.shopId = shop.id;
          } else {
            console.log('Shop not found!!');
          }
        });

        this.accountService.getCustomer().subscribe(customer => {
          // Check if customer is not null or undefined
          if (customer) {
            // Print the customer's ID
            console.log('Customer ID: ', customer.id);
            this.customerId = customer.id;
          } else {
            console.log('Customer not found');
          }
        });
      }
    });

    this.activatedRoute.data.subscribe(({ application }) => {
      this.application = application;
    });
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

  acceptApplication(application: IApplication): void {
    application.applicationStatus = ApplicationStatus.ACCEPTED;
    this.applicationService.update(application).subscribe(
      () => {},
      error => {
        console.log('Failed to update application status.');
      }
    );
  }

  rejectApplication(application: IApplication): void {
    application.applicationStatus = ApplicationStatus.REJECTED;
    this.applicationService.update(application).subscribe(
      () => {},
      error => {
        console.log('Failed to update application status.');
      }
    );
  }

  pendingApplication(application: IApplication): void {
    application.applicationStatus = ApplicationStatus.PENDING;
    this.applicationService.update(application).subscribe(
      () => {},
      error => {
        console.log('Failed to update application status.');
      }
    );
  }

  protected isAccepted(application: IApplication) {
    return application.applicationStatus === ApplicationStatus.ACCEPTED;
  }

  protected isRejected(application: IApplication) {
    return application.applicationStatus === ApplicationStatus.REJECTED;
  }

  protected isPending(application: IApplication) {
    return application.applicationStatus === ApplicationStatus.PENDING;
  }
}
