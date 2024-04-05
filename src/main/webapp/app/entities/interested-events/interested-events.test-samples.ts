import { IInterestedEvents, NewInterestedEvents } from './interested-events.model';

export const sampleWithRequiredData: IInterestedEvents = {
  id: 73637,
};

export const sampleWithPartialData: IInterestedEvents = {
  id: 53595,
};

export const sampleWithFullData: IInterestedEvents = {
  id: 97451,
};

export const sampleWithNewData: NewInterestedEvents = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
