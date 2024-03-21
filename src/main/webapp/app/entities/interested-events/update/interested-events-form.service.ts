import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IInterestedEvents, NewInterestedEvents } from '../interested-events.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IInterestedEvents for edit and NewInterestedEventsFormGroupInput for create.
 */
type InterestedEventsFormGroupInput = IInterestedEvents | PartialWithRequiredKeyOf<NewInterestedEvents>;

type InterestedEventsFormDefaults = Pick<NewInterestedEvents, 'id'>;

type InterestedEventsFormGroupContent = {
  id: FormControl<IInterestedEvents['id'] | NewInterestedEvents['id']>;
  user: FormControl<IInterestedEvents['user']>;
  event: FormControl<IInterestedEvents['event']>;
};

export type InterestedEventsFormGroup = FormGroup<InterestedEventsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class InterestedEventsFormService {
  createInterestedEventsFormGroup(interestedEvents: InterestedEventsFormGroupInput = { id: null }): InterestedEventsFormGroup {
    const interestedEventsRawValue = {
      ...this.getFormDefaults(),
      ...interestedEvents,
    };
    return new FormGroup<InterestedEventsFormGroupContent>({
      id: new FormControl(
        { value: interestedEventsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      user: new FormControl(interestedEventsRawValue.user),
      event: new FormControl(interestedEventsRawValue.event),
    });
  }

  getInterestedEvents(form: InterestedEventsFormGroup): IInterestedEvents | NewInterestedEvents {
    return form.getRawValue() as IInterestedEvents | NewInterestedEvents;
  }

  resetForm(form: InterestedEventsFormGroup, interestedEvents: InterestedEventsFormGroupInput): void {
    const interestedEventsRawValue = { ...this.getFormDefaults(), ...interestedEvents };
    form.reset(
      {
        ...interestedEventsRawValue,
        id: { value: interestedEventsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): InterestedEventsFormDefaults {
    return {
      id: null,
    };
  }
}
