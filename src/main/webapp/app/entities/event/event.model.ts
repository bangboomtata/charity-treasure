import dayjs from 'dayjs/esm';
import { IShop } from 'app/entities/shop/shop.model';
import { Location } from 'app/entities/enumerations/location.model';

export interface IEvent {
  id: number;
  eventName?: string | null;
  eventDate?: dayjs.Dayjs | null;
  eventDescription?: string | null;
  eventAddress?: string | null;
  eventLocation?: Location | null;
  eventCity?: string | null;
  eventTime?: string | null;
  contactNumber?: string | null;
  eventEmail?: string | null;
  eventImage?: string | null;
  eventImageContentType?: string | null;
  eventEndDate?: dayjs.Dayjs | null;
  shop?: Pick<IShop, 'id'> | null;
}

export type NewEvent = Omit<IEvent, 'id'> & { id: null };
