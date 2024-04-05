import dayjs from 'dayjs/esm';

import { IFeedback, NewFeedback } from './feedback.model';

export const sampleWithRequiredData: IFeedback = {
  id: 38124,
  feedbackText: '../fake-data/blob/hipster.txt',
};

export const sampleWithPartialData: IFeedback = {
  id: 75900,
  feedbackText: '../fake-data/blob/hipster.txt',
};

export const sampleWithFullData: IFeedback = {
  id: 89080,
  feedbackText: '../fake-data/blob/hipster.txt',
  time: dayjs('2024-04-04T01:01'),
};

export const sampleWithNewData: NewFeedback = {
  feedbackText: '../fake-data/blob/hipster.txt',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
