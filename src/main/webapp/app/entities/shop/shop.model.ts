import dayjs from 'dayjs/esm';
import { IUser } from 'app/entities/user/user.model';

export interface IShop {
  id: number;
  shopName?: string | null;
  contactNum?: string | null;
  shopEmail?: string | null;
  charityShopId?: string | null;
  openHoursWeekdays?: string | null;
  openHoursWeekends?: string | null;
  openHoursHolidays?: string | null;
  street?: string | null;
  city?: string | null;
  postCode?: string | null;
  country?: string | null;
  creationDate?: dayjs.Dayjs | null;
  logo?: string | null;
  logoContentType?: string | null;
  rating?: number | null;
  distance?: number | null;
  duration?: string | null;
  user?: IUser | null;
}

export type NewShop = Omit<IShop, 'id'> & { id: null };
