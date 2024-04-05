import dayjs from 'dayjs/esm';

import { IChat, NewChat } from './chat.model';

export const sampleWithRequiredData: IChat = {
  id: 24892,
  senderLogin: 'Grocery',
  receiverLogin: 'Singapore',
  timestamp: dayjs('2024-04-03T23:40'),
};

export const sampleWithPartialData: IChat = {
  id: 24472,
  senderLogin: 'Bike',
  receiverLogin: 'Towels National complexity',
  message: 'Web Dollar',
  timestamp: dayjs('2024-04-04T22:03'),
};

export const sampleWithFullData: IChat = {
  id: 55369,
  senderLogin: 'emulation deposit',
  receiverLogin: 'indigo Investor',
  message: 'Investment',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  timestamp: dayjs('2024-04-04T11:48'),
};

export const sampleWithNewData: NewChat = {
  senderLogin: 'Sharable',
  receiverLogin: 'Wooden homogeneous Buckinghamshire',
  timestamp: dayjs('2024-04-04T10:16'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
