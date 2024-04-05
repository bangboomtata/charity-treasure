import { ICustomer } from 'app/entities/customer/customer.model';

export interface ICustomerEmails {
  id: number;
  email?: string | null;
  customer?: Pick<ICustomer, 'id'> | null;
}

export type NewCustomerEmails = Omit<ICustomerEmails, 'id'> & { id: null };
