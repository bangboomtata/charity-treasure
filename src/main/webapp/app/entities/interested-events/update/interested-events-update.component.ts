import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { InterestedEventsFormService, InterestedEventsFormGroup } from './interested-events-form.service';
import { IInterestedEvents } from '../interested-events.model';
import { InterestedEventsService } from '../service/interested-events.service';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

@Component({
  selector: 'jhi-interested-events-update',
  templateUrl: './interested-events-update.component.html',
})
export class InterestedEventsUpdateComponent implements OnInit {
  isSaving = false;
  interestedEvents: IInterestedEvents | null = null;

  customersSharedCollection: ICustomer[] = [];
  eventsSharedCollection: IEvent[] = [];

  editForm: InterestedEventsFormGroup = this.interestedEventsFormService.createInterestedEventsFormGroup();

  constructor(
    protected interestedEventsService: InterestedEventsService,
    protected interestedEventsFormService: InterestedEventsFormService,
    protected customerService: CustomerService,
    protected eventService: EventService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareCustomer = (o1: ICustomer | null, o2: ICustomer | null): boolean => this.customerService.compareCustomer(o1, o2);

  compareEvent = (o1: IEvent | null, o2: IEvent | null): boolean => this.eventService.compareEvent(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ interestedEvents }) => {
      this.interestedEvents = interestedEvents;
      if (interestedEvents) {
        this.updateForm(interestedEvents);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const interestedEvents = this.interestedEventsFormService.getInterestedEvents(this.editForm);
    if (interestedEvents.id !== null) {
      this.subscribeToSaveResponse(this.interestedEventsService.update(interestedEvents));
    } else {
      this.subscribeToSaveResponse(this.interestedEventsService.create(interestedEvents));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IInterestedEvents>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(interestedEvents: IInterestedEvents): void {
    this.interestedEvents = interestedEvents;
    this.interestedEventsFormService.resetForm(this.editForm, interestedEvents);

    this.customersSharedCollection = this.customerService.addCustomerToCollectionIfMissing<ICustomer>(
      this.customersSharedCollection,
      interestedEvents.user
    );
    this.eventsSharedCollection = this.eventService.addEventToCollectionIfMissing<IEvent>(
      this.eventsSharedCollection,
      interestedEvents.event
    );
  }

  protected loadRelationshipsOptions(): void {
    this.customerService
      .query()
      .pipe(map((res: HttpResponse<ICustomer[]>) => res.body ?? []))
      .pipe(
        map((customers: ICustomer[]) =>
          this.customerService.addCustomerToCollectionIfMissing<ICustomer>(customers, this.interestedEvents?.user)
        )
      )
      .subscribe((customers: ICustomer[]) => (this.customersSharedCollection = customers));

    this.eventService
      .query()
      .pipe(map((res: HttpResponse<IEvent[]>) => res.body ?? []))
      .pipe(map((events: IEvent[]) => this.eventService.addEventToCollectionIfMissing<IEvent>(events, this.interestedEvents?.event)))
      .subscribe((events: IEvent[]) => (this.eventsSharedCollection = events));
  }
}
