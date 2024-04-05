import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEvent } from '../event.model';
import { DataUtils } from 'app/core/util/data-util.service';

//my added imports
import { InterestedEventsService } from '../../interested-events/service/interested-events.service';
import { InterestedEventsFormGroup, InterestedEventsFormService } from '../../interested-events/update/interested-events-form.service';
import { IInterestedEvents } from '../../interested-events/interested-events.model';
import { EventService } from '../service/event.service';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { finalize } from 'rxjs/operators';

import { AccountService } from '../../../core/auth/account.service';
import { ICustomer } from '../../customer/customer.model';

@Component({
  selector: 'jhi-event-detail',
  styleUrls: ['./event-detail.component.scss'],
  templateUrl: './event-detail.component.html',
})
export class EventDetailComponent implements OnInit {
  event: IEvent | null = null;

  //stuff I added
  interestedEventDetails: InterestedEventsFormGroup = this.interestedEventsFormService.createInterestedEventsFormGroup();
  isSaving = false;

  customer: ICustomer | null = null;

  constructor(
    protected dataUtils: DataUtils,
    protected activatedRoute: ActivatedRoute,
    protected interestedEventsService: InterestedEventsService,
    protected interestedEventsFormService: InterestedEventsFormService,
    protected accountService: AccountService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ event }) => {
      this.event = event;
    });

    this.accountService.identity().subscribe(account => {
      if (account) {
        this.accountService.getCustomer().subscribe(customer => {
          if (customer) {
            this.customer = customer;
          }
        });
      }
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

  //method to add detail of event to interested events entity
  transferToInterested(): void {
    this.interestedEventDetails.patchValue({
      event: this.event,
    });

    this.interestedEventDetails.patchValue({
      user: this.customer,
    });

    const interestedEvent = this.interestedEventsFormService.getInterestedEvents(this.interestedEventDetails);
    if (interestedEvent.id == null) {
      this.subscribeToSaveResponse2(this.interestedEventsService.create(interestedEvent));
    }
  }

  protected subscribeToSaveResponse2(result: Observable<HttpResponse<IInterestedEvents>>): void {
    result.pipe(finalize(() => this.onSaveFinalize2())).subscribe({
      next: () => this.onSaveSuccess2(),
      error: () => this.onSaveError2(),
    });
  }

  protected onSaveSuccess2(): void {
    this.previousState();
  }

  protected onSaveError2(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize2(): void {
    this.isSaving = false;
  }
}
