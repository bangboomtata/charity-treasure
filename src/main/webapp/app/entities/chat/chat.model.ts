import dayjs from 'dayjs/esm';
import { ICustomer } from '../customer/customer.model';
import { IShop } from '../shop/shop.model';

export interface IChat {
  id: number;
  senderLogin?: string | null;
  receiverLogin?: string | null;
  message?: string | null;
  image?: string | null;
  imageContentType?: string | null;
  timestamp?: dayjs.Dayjs | null;
  shop?: IShop | null;
}

export type NewChat = Omit<IChat, 'id'> & { id: null };
