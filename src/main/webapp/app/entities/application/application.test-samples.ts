import dayjs from 'dayjs/esm';

import { ApplicationStatus } from 'app/entities/enumerations/application-status.model';

import { IApplication, NewApplication } from './application.model';

export const sampleWithRequiredData: IApplication = {
  id: 99506,
  firstName: 'Aimee',
  lastName: 'Kulas',
  contactNum: 'Gloves',
};

export const sampleWithPartialData: IApplication = {
  id: 6067,
  firstName: 'Liza',
  lastName: 'Heidenreich',
  contactNum: 'Oregon',
  dateOfBirth: dayjs('2024-04-04'),
  relevantSkills: '../fake-data/blob/hipster.txt',
  applicationDate: dayjs('2024-04-04'),
  applicationStatus: ApplicationStatus['PENDING'],
  appliedFriday: true,
  appliedSaturday: true,
  appliedAfternoon: false,
  appliedEvening: false,
};

export const sampleWithFullData: IApplication = {
  id: 16181,
  firstName: 'Rodger',
  lastName: 'Heller',
  contactNum: 'Assistant alarm',
  email: 'Kadin_Mueller@yahoo.com',
  dateOfBirth: dayjs('2024-04-04'),
  commitmentDuration: 'CSS',
  volunteerExperience: 'world-class quantify Codes',
  relevantSkills: '../fake-data/blob/hipster.txt',
  motivation: '../fake-data/blob/hipster.txt',
  applicationDate: dayjs('2024-04-04'),
  applicationStatus: ApplicationStatus['ACCEPTED'],
  appliedMonday: true,
  appliedTuesday: false,
  appliedWednesday: false,
  appliedThursday: false,
  appliedFriday: true,
  appliedSaturday: true,
  appliedSunday: true,
  appliedMorning: false,
  appliedAfternoon: true,
  appliedEvening: false,
};

export const sampleWithNewData: NewApplication = {
  firstName: 'Mary',
  lastName: 'Blanda',
  contactNum: 'Bike',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
