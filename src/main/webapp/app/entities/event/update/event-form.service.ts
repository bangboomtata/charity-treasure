import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IEvent, NewEvent } from '../event.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEvent for edit and NewEventFormGroupInput for create.
 */
type EventFormGroupInput = IEvent | PartialWithRequiredKeyOf<NewEvent>;

type EventFormDefaults = Pick<NewEvent, 'id'>;

type EventFormGroupContent = {
  id: FormControl<IEvent['id'] | NewEvent['id']>;
  eventName: FormControl<IEvent['eventName']>;
  eventDate: FormControl<IEvent['eventDate']>;
  eventDescription: FormControl<IEvent['eventDescription']>;
  eventAddress: FormControl<IEvent['eventAddress']>;
  eventLocation: FormControl<IEvent['eventLocation']>;
  eventCity: FormControl<IEvent['eventCity']>;
  eventTime: FormControl<IEvent['eventTime']>;
  contactNumber: FormControl<IEvent['contactNumber']>;
  eventEmail: FormControl<IEvent['eventEmail']>;
  eventImage: FormControl<IEvent['eventImage']>;
  eventImageContentType: FormControl<IEvent['eventImageContentType']>;
  eventEndDate: FormControl<IEvent['eventEndDate']>;
  shop: FormControl<IEvent['shop']>;
};

export type EventFormGroup = FormGroup<EventFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EventFormService {
  createEventFormGroup(event: EventFormGroupInput = { id: null }): EventFormGroup {
    const eventRawValue = {
      ...this.getFormDefaults(),
      ...event,
    };
    return new FormGroup<EventFormGroupContent>({
      id: new FormControl(
        { value: eventRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      eventName: new FormControl(eventRawValue.eventName, {
        validators: [Validators.required],
      }),
      eventDate: new FormControl(eventRawValue.eventDate, {
        validators: [Validators.required],
      }),
      eventDescription: new FormControl(eventRawValue.eventDescription, {
        validators: [Validators.required],
      }),
      eventAddress: new FormControl(eventRawValue.eventAddress, {
        validators: [Validators.required],
      }),
      eventLocation: new FormControl(eventRawValue.eventLocation),
      eventCity: new FormControl(eventRawValue.eventCity, {
        validators: [Validators.required],
      }),
      eventTime: new FormControl(eventRawValue.eventTime),
      contactNumber: new FormControl(eventRawValue.contactNumber),
      eventEmail: new FormControl(eventRawValue.eventEmail),
      eventImage: new FormControl(eventRawValue.eventImage),
      eventImageContentType: new FormControl(eventRawValue.eventImageContentType),
      eventEndDate: new FormControl(eventRawValue.eventEndDate),
      shop: new FormControl(eventRawValue.shop),
    });
  }

  getEvent(form: EventFormGroup): IEvent | NewEvent {
    return form.getRawValue() as IEvent | NewEvent;
  }

  resetForm(form: EventFormGroup, event: EventFormGroupInput): void {
    const eventRawValue = { ...this.getFormDefaults(), ...event };
    form.reset(
      {
        ...eventRawValue,
        id: { value: eventRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): EventFormDefaults {
    return {
      id: null,
    };
  }
}
