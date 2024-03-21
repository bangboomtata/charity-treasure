import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IApplication, NewApplication } from '../application.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IApplication for edit and NewApplicationFormGroupInput for create.
 */
type ApplicationFormGroupInput = IApplication | PartialWithRequiredKeyOf<NewApplication>;

type ApplicationFormDefaults = Pick<
  NewApplication,
  | 'id'
  | 'appliedMonday'
  | 'appliedTuesday'
  | 'appliedWednesday'
  | 'appliedThursday'
  | 'appliedFriday'
  | 'appliedSaturday'
  | 'appliedSunday'
  | 'appliedMorning'
  | 'appliedAfternoon'
  | 'appliedEvening'
>;

type ApplicationFormGroupContent = {
  id: FormControl<IApplication['id'] | NewApplication['id']>;
  firstName: FormControl<IApplication['firstName']>;
  lastName: FormControl<IApplication['lastName']>;
  contactNum: FormControl<IApplication['contactNum']>;
  email: FormControl<IApplication['email']>;
  dateOfBirth: FormControl<IApplication['dateOfBirth']>;
  commitmentDuration: FormControl<IApplication['commitmentDuration']>;
  volunteerExperience: FormControl<IApplication['volunteerExperience']>;
  relevantSkills: FormControl<IApplication['relevantSkills']>;
  motivation: FormControl<IApplication['motivation']>;
  applicationDate: FormControl<IApplication['applicationDate']>;
  applicationStatus: FormControl<IApplication['applicationStatus']>;
  appliedMonday: FormControl<IApplication['appliedMonday']>;
  appliedTuesday: FormControl<IApplication['appliedTuesday']>;
  appliedWednesday: FormControl<IApplication['appliedWednesday']>;
  appliedThursday: FormControl<IApplication['appliedThursday']>;
  appliedFriday: FormControl<IApplication['appliedFriday']>;
  appliedSaturday: FormControl<IApplication['appliedSaturday']>;
  appliedSunday: FormControl<IApplication['appliedSunday']>;
  appliedMorning: FormControl<IApplication['appliedMorning']>;
  appliedAfternoon: FormControl<IApplication['appliedAfternoon']>;
  appliedEvening: FormControl<IApplication['appliedEvening']>;
  post: FormControl<IApplication['post']>;
  customer: FormControl<IApplication['customer']>;
};

export type ApplicationFormGroup = FormGroup<ApplicationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ApplicationFormService {
  createApplicationFormGroup(application: ApplicationFormGroupInput = { id: null }): ApplicationFormGroup {
    const applicationRawValue = {
      ...this.getFormDefaults(),
      ...application,
    };
    return new FormGroup<ApplicationFormGroupContent>({
      id: new FormControl(
        { value: applicationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      firstName: new FormControl(applicationRawValue.firstName, {
        validators: [Validators.required],
      }),
      lastName: new FormControl(applicationRawValue.lastName, {
        validators: [Validators.required],
      }),
      contactNum: new FormControl(applicationRawValue.contactNum, {
        validators: [Validators.required],
      }),
      email: new FormControl(applicationRawValue.email),
      dateOfBirth: new FormControl(applicationRawValue.dateOfBirth),
      commitmentDuration: new FormControl(applicationRawValue.commitmentDuration),
      volunteerExperience: new FormControl(applicationRawValue.volunteerExperience),
      relevantSkills: new FormControl(applicationRawValue.relevantSkills),
      motivation: new FormControl(applicationRawValue.motivation),
      applicationDate: new FormControl(applicationRawValue.applicationDate),
      applicationStatus: new FormControl(applicationRawValue.applicationStatus),
      appliedMonday: new FormControl(applicationRawValue.appliedMonday),
      appliedTuesday: new FormControl(applicationRawValue.appliedTuesday),
      appliedWednesday: new FormControl(applicationRawValue.appliedWednesday),
      appliedThursday: new FormControl(applicationRawValue.appliedThursday),
      appliedFriday: new FormControl(applicationRawValue.appliedFriday),
      appliedSaturday: new FormControl(applicationRawValue.appliedSaturday),
      appliedSunday: new FormControl(applicationRawValue.appliedSunday),
      appliedMorning: new FormControl(applicationRawValue.appliedMorning),
      appliedAfternoon: new FormControl(applicationRawValue.appliedAfternoon),
      appliedEvening: new FormControl(applicationRawValue.appliedEvening),
      post: new FormControl(applicationRawValue.post),
      customer: new FormControl(applicationRawValue.customer),
    });
  }

  getApplication(form: ApplicationFormGroup): IApplication | NewApplication {
    return form.getRawValue() as IApplication | NewApplication;
  }

  resetForm(form: ApplicationFormGroup, application: ApplicationFormGroupInput): void {
    const applicationRawValue = { ...this.getFormDefaults(), ...application };
    form.reset(
      {
        ...applicationRawValue,
        id: { value: applicationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ApplicationFormDefaults {
    return {
      id: null,
      appliedMonday: false,
      appliedTuesday: false,
      appliedWednesday: false,
      appliedThursday: false,
      appliedFriday: false,
      appliedSaturday: false,
      appliedSunday: false,
      appliedMorning: false,
      appliedAfternoon: false,
      appliedEvening: false,
    };
  }
}
