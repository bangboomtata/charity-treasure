import { ICustomerEmails, NewCustomerEmails } from './customer-emails.model';

export const sampleWithRequiredData: ICustomerEmails = {
  id: 65236,
};

export const sampleWithPartialData: ICustomerEmails = {
  id: 88310,
  email: 'Gust32@yahoo.com',
};

export const sampleWithFullData: ICustomerEmails = {
  id: 78521,
  email: 'Amanda.Gislason@hotmail.com',
};

export const sampleWithNewData: NewCustomerEmails = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
