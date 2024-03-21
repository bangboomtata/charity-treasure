import dayjs from 'dayjs/esm';

import { ReservationStatus } from 'app/entities/enumerations/reservation-status.model';

import { IReservation, NewReservation } from './reservation.model';

export const sampleWithRequiredData: IReservation = {
  id: 52422,
  reservedTime: dayjs('2024-03-21T08:11'),
  reservedExpiry: dayjs('2024-03-21T08:36'),
};

export const sampleWithPartialData: IReservation = {
  id: 93887,
  reservedTime: dayjs('2024-03-21T02:48'),
  reservedExpiry: dayjs('2024-03-20T17:07'),
  status: ReservationStatus['COLLECTED'],
};

export const sampleWithFullData: IReservation = {
  id: 20488,
  reservedTime: dayjs('2024-03-20T23:47'),
  reservedExpiry: dayjs('2024-03-21T03:39'),
  status: ReservationStatus['COLLECTED'],
};

export const sampleWithNewData: NewReservation = {
  reservedTime: dayjs('2024-03-21T10:37'),
  reservedExpiry: dayjs('2024-03-21T02:11'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
