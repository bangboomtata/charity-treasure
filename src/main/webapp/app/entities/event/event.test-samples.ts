import dayjs from 'dayjs/esm';

import { Location } from 'app/entities/enumerations/location.model';

import { IEvent, NewEvent } from './event.model';

export const sampleWithRequiredData: IEvent = {
  id: 63022,
  eventName: 'Cotton',
  eventDate: dayjs('2024-03-21'),
  eventDescription: '../fake-data/blob/hipster.txt',
  eventAddress: '../fake-data/blob/hipster.txt',
  eventCity: 'Games',
};

export const sampleWithPartialData: IEvent = {
  id: 65385,
  eventName: 'teal Dollar',
  eventDate: dayjs('2024-03-21'),
  eventDescription: '../fake-data/blob/hipster.txt',
  eventAddress: '../fake-data/blob/hipster.txt',
  eventCity: 'generating Tuna coherent',
  contactNumber: 'virtual',
  eventEmail: 'transmit generation fuchsia',
};

export const sampleWithFullData: IEvent = {
  id: 4466,
  eventName: 'open mint Locks',
  eventDate: dayjs('2024-03-20'),
  eventDescription: '../fake-data/blob/hipster.txt',
  eventAddress: '../fake-data/blob/hipster.txt',
  eventLocation: Location['SOUTHWEST'],
  eventCity: 'Refined synergistic',
  eventTime: 'Tasty Throughway',
  contactNumber: 'Future-proofed',
  eventEmail: 'Stravenue Virtual Louisiana',
  eventImage: '../fake-data/blob/hipster.png',
  eventImageContentType: 'unknown',
  eventEndDate: dayjs('2024-03-20'),
};

export const sampleWithNewData: NewEvent = {
  eventName: 'Money',
  eventDate: dayjs('2024-03-21'),
  eventDescription: '../fake-data/blob/hipster.txt',
  eventAddress: '../fake-data/blob/hipster.txt',
  eventCity: 'override neural',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
