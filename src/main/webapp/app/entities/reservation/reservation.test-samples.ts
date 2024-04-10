import dayjs from 'dayjs/esm';

import { ReservationStatus } from 'app/entities/enumerations/reservation-status.model';

import { IReservation, NewReservation } from './reservation.model';

export const sampleWithRequiredData: IReservation = {
  id: 52422,
  reservedTime: dayjs('2024-04-04T17:31'),
  reservedExpiry: dayjs('2024-04-04T17:56'),
};

export const sampleWithPartialData: IReservation = {
  id: 93887,
  reservedTime: dayjs('2024-04-04T12:09'),
  reservedExpiry: dayjs('2024-04-04T02:27'),
  status: ReservationStatus['COLLECTED'],
};

export const sampleWithFullData: IReservation = {
  id: 20488,
  reservedTime: dayjs('2024-04-04T09:07'),
  reservedExpiry: dayjs('2024-04-04T12:59'),
  status: ReservationStatus['COLLECTED'],
};

export const sampleWithNewData: NewReservation = {
  reservedTime: dayjs('2024-04-04T19:57'),
  reservedExpiry: dayjs('2024-04-04T11:31'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
