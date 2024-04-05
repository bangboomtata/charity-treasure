import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IVolunteerPost, NewVolunteerPost } from '../volunteer-post.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IVolunteerPost for edit and NewVolunteerPostFormGroupInput for create.
 */
type VolunteerPostFormGroupInput = IVolunteerPost | PartialWithRequiredKeyOf<NewVolunteerPost>;

type VolunteerPostFormDefaults = Pick<
  NewVolunteerPost,
  'id' | 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday' | 'morning' | 'afternoon' | 'evening'
>;

type VolunteerPostFormGroupContent = {
  id: FormControl<IVolunteerPost['id'] | NewVolunteerPost['id']>;
  postTitle: FormControl<IVolunteerPost['postTitle']>;
  locationAddress: FormControl<IVolunteerPost['locationAddress']>;
  contactNum: FormControl<IVolunteerPost['contactNum']>;
  email: FormControl<IVolunteerPost['email']>;
  aboutUs: FormControl<IVolunteerPost['aboutUs']>;
  aboutRole: FormControl<IVolunteerPost['aboutRole']>;
  benefits: FormControl<IVolunteerPost['benefits']>;
  img: FormControl<IVolunteerPost['img']>;
  imgContentType: FormControl<IVolunteerPost['imgContentType']>;
  activeStatus: FormControl<IVolunteerPost['activeStatus']>;
  startDate: FormControl<IVolunteerPost['startDate']>;
  monday: FormControl<IVolunteerPost['monday']>;
  tuesday: FormControl<IVolunteerPost['tuesday']>;
  wednesday: FormControl<IVolunteerPost['wednesday']>;
  thursday: FormControl<IVolunteerPost['thursday']>;
  friday: FormControl<IVolunteerPost['friday']>;
  saturday: FormControl<IVolunteerPost['saturday']>;
  sunday: FormControl<IVolunteerPost['sunday']>;
  morning: FormControl<IVolunteerPost['morning']>;
  afternoon: FormControl<IVolunteerPost['afternoon']>;
  evening: FormControl<IVolunteerPost['evening']>;
  shop: FormControl<IVolunteerPost['shop']>;
};

export type VolunteerPostFormGroup = FormGroup<VolunteerPostFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class VolunteerPostFormService {
  createVolunteerPostFormGroup(volunteerPost: VolunteerPostFormGroupInput = { id: null }): VolunteerPostFormGroup {
    const volunteerPostRawValue = {
      ...this.getFormDefaults(),
      ...volunteerPost,
    };
    return new FormGroup<VolunteerPostFormGroupContent>({
      id: new FormControl(
        { value: volunteerPostRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      postTitle: new FormControl(volunteerPostRawValue.postTitle, {
        validators: [Validators.required],
      }),
      locationAddress: new FormControl(volunteerPostRawValue.locationAddress),
      contactNum: new FormControl(volunteerPostRawValue.contactNum),
      email: new FormControl(volunteerPostRawValue.email),
      aboutUs: new FormControl(volunteerPostRawValue.aboutUs),
      aboutRole: new FormControl(volunteerPostRawValue.aboutRole),
      benefits: new FormControl(volunteerPostRawValue.benefits),
      img: new FormControl(volunteerPostRawValue.img),
      imgContentType: new FormControl(volunteerPostRawValue.imgContentType),
      activeStatus: new FormControl(volunteerPostRawValue.activeStatus),
      startDate: new FormControl(volunteerPostRawValue.startDate),
      monday: new FormControl(volunteerPostRawValue.monday),
      tuesday: new FormControl(volunteerPostRawValue.tuesday),
      wednesday: new FormControl(volunteerPostRawValue.wednesday),
      thursday: new FormControl(volunteerPostRawValue.thursday),
      friday: new FormControl(volunteerPostRawValue.friday),
      saturday: new FormControl(volunteerPostRawValue.saturday),
      sunday: new FormControl(volunteerPostRawValue.sunday),
      morning: new FormControl(volunteerPostRawValue.morning),
      afternoon: new FormControl(volunteerPostRawValue.afternoon),
      evening: new FormControl(volunteerPostRawValue.evening),
      shop: new FormControl(volunteerPostRawValue.shop),
    });
  }

  getVolunteerPost(form: VolunteerPostFormGroup): IVolunteerPost | NewVolunteerPost {
    return form.getRawValue() as IVolunteerPost | NewVolunteerPost;
  }

  resetForm(form: VolunteerPostFormGroup, volunteerPost: VolunteerPostFormGroupInput): void {
    const volunteerPostRawValue = { ...this.getFormDefaults(), ...volunteerPost };
    form.reset(
      {
        ...volunteerPostRawValue,
        id: { value: volunteerPostRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): VolunteerPostFormDefaults {
    return {
      id: null,
      monday: false,
      tuesday: false,
      wednesday: false,
      thursday: false,
      friday: false,
      saturday: false,
      sunday: false,
      morning: false,
      afternoon: false,
      evening: false,
    };
  }
}
