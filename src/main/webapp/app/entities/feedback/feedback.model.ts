import dayjs from 'dayjs/esm';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IShop } from 'app/entities/shop/shop.model';

export interface IFeedback {
  id: number;
  feedbackText?: string | null;
  time?: dayjs.Dayjs | null;
  customer?: Pick<ICustomer, 'id'> | null;
  shop?: Pick<IShop, 'id'> | null;
}

export type NewFeedback = Omit<IFeedback, 'id'> & { id: null };
