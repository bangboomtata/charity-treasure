import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IApplication } from '../application.model';
import { DataUtils } from 'app/core/util/data-util.service';
import { ApplicationStatus } from 'app/entities/enumerations/application-status.model';
import { ApplicationService } from '../service/application.service';

@Component({
  selector: 'jhi-application-detail',
  templateUrl: './application-detail.component.html',
  styleUrls: ['./application-detail.component.scss'],
})
export class ApplicationDetailComponent implements OnInit {
  application: IApplication | null = null;

  constructor(protected dataUtils: DataUtils, protected activatedRoute: ActivatedRoute, protected applicationService: ApplicationService) {}

  ngOnInit(): void {
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
