import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IReservation, NewReservation } from '../reservation.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReservation for edit and NewReservationFormGroupInput for create.
 */
type ReservationFormGroupInput = IReservation | PartialWithRequiredKeyOf<NewReservation>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IReservation | NewReservation> = Omit<T, 'reservedTime' | 'reservedExpiry'> & {
  reservedTime?: string | null;
  reservedExpiry?: string | null;
};

type ReservationFormRawValue = FormValueOf<IReservation>;

type NewReservationFormRawValue = FormValueOf<NewReservation>;

type ReservationFormDefaults = Pick<NewReservation, 'id' | 'reservedTime' | 'reservedExpiry'>;

type ReservationFormGroupContent = {
  id: FormControl<ReservationFormRawValue['id'] | NewReservation['id']>;
  reservedTime: FormControl<ReservationFormRawValue['reservedTime']>;
  reservedExpiry: FormControl<ReservationFormRawValue['reservedExpiry']>;
  status: FormControl<ReservationFormRawValue['status']>;
  item: FormControl<ReservationFormRawValue['item']>;
  // customer: FormControl<ReservationFormRawValue['customer']>;
  customerName: FormControl<string | null | undefined>;

  shop: FormControl<ReservationFormRawValue['shop']>;

  [key: string]: FormControl<any>;
};

export type ReservationFormGroup = FormGroup<ReservationFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReservationFormService {
  createReservationFormGroup(reservation: ReservationFormGroupInput = { id: null }): ReservationFormGroup {
    const reservationRawValue = this.convertReservationToReservationRawValue({
      ...this.getFormDefaults(),
      ...reservation,
    });
    return new FormGroup<ReservationFormGroupContent>({
      id: new FormControl(
        { value: reservationRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      reservedTime: new FormControl(reservationRawValue.reservedTime, {
        validators: [Validators.required],
      }),
      reservedExpiry: new FormControl(reservationRawValue.reservedExpiry, {
        validators: [Validators.required],
      }),
      status: new FormControl(reservationRawValue.status),
      item: new FormControl(reservationRawValue.item),

      // In your ReservationFormService or wherever the form group is initialized:
      customerName: new FormControl('', [Validators.required, Validators.minLength(2)]),

      shop: new FormControl(reservationRawValue.shop),
    });
  }

  getReservation(form: ReservationFormGroup): IReservation | NewReservation {
    return this.convertReservationRawValueToReservation(form.getRawValue() as ReservationFormRawValue | NewReservationFormRawValue);
  }

  resetForm(form: ReservationFormGroup, reservation: ReservationFormGroupInput): void {
    const reservationRawValue = this.convertReservationToReservationRawValue({ ...this.getFormDefaults(), ...reservation });
    form.reset(
      {
        ...reservationRawValue,
        id: { value: reservationRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReservationFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      reservedTime: currentTime,
      reservedExpiry: currentTime,
    };
  }

  private convertReservationRawValueToReservation(
    rawReservation: ReservationFormRawValue | NewReservationFormRawValue
  ): IReservation | NewReservation {
    return {
      ...rawReservation,
      reservedTime: dayjs(rawReservation.reservedTime, DATE_TIME_FORMAT),
      reservedExpiry: dayjs(rawReservation.reservedExpiry, DATE_TIME_FORMAT),
    };
  }

  private convertReservationToReservationRawValue(
    reservation: IReservation | (Partial<NewReservation> & ReservationFormDefaults)
  ): ReservationFormRawValue | PartialWithRequiredKeyOf<NewReservationFormRawValue> {
    return {
      ...reservation,
      reservedTime: reservation.reservedTime ? reservation.reservedTime.format(DATE_TIME_FORMAT) : undefined,
      reservedExpiry: reservation.reservedExpiry ? reservation.reservedExpiry.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
