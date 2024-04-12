import dayjs from 'dayjs/esm';
import { IItem } from 'app/entities/item/item.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ReservationStatus } from 'app/entities/enumerations/reservation-status.model';

export interface IReservation {
  id: number;
  reservedTime?: dayjs.Dayjs | null;
  reservedExpiry?: dayjs.Dayjs | null;
  status?: ReservationStatus | null;
  item?: Pick<IItem, 'id'> | null;
  customer?: Pick<ICustomer, 'id' | 'customerName'> | null;
  shop?: Pick<IShop, 'id'> | null;
}

export type NewReservation = Omit<IReservation, 'id'> & { id: null };
