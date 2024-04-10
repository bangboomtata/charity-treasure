import dayjs from 'dayjs/esm';

import { ActiveStatus } from 'app/entities/enumerations/active-status.model';

import { IVolunteerPost, NewVolunteerPost } from './volunteer-post.model';

export const sampleWithRequiredData: IVolunteerPost = {
  id: 96920,
  postTitle: 'Brook dot-com neural',
};

export const sampleWithPartialData: IVolunteerPost = {
  id: 45493,
  postTitle: 'Tools and',
  benefits: '../fake-data/blob/hipster.txt',
  startDate: dayjs('2024-04-04'),
  tuesday: true,
  morning: false,
  evening: false,
};

export const sampleWithFullData: IVolunteerPost = {
  id: 46901,
  postTitle: 'Small',
  locationAddress: 'alarm District methodology',
  contactNum: 'object-oriented',
  email: 'Willy_Carter80@yahoo.com',
  aboutUs: '../fake-data/blob/hipster.txt',
  aboutRole: '../fake-data/blob/hipster.txt',
  benefits: '../fake-data/blob/hipster.txt',
  img: '../fake-data/blob/hipster.png',
  imgContentType: 'unknown',
  activeStatus: ActiveStatus['ACTIVE'],
  startDate: dayjs('2024-04-03'),
  monday: true,
  tuesday: true,
  wednesday: true,
  thursday: true,
  friday: true,
  saturday: false,
  sunday: false,
  morning: false,
  afternoon: true,
  evening: false,
};

export const sampleWithNewData: NewVolunteerPost = {
  postTitle: 'Inlet revolutionary Orchestrator',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
