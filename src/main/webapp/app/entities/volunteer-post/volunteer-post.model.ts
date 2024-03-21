import dayjs from 'dayjs/esm';
import { IShop } from 'app/entities/shop/shop.model';
import { ActiveStatus } from 'app/entities/enumerations/active-status.model';

export interface IVolunteerPost {
  id: number;
  postTitle?: string | null;
  locationAddress?: string | null;
  contactNum?: string | null;
  email?: string | null;
  aboutUs?: string | null;
  aboutRole?: string | null;
  benefits?: string | null;
  img?: string | null;
  imgContentType?: string | null;
  activeStatus?: ActiveStatus | null;
  startDate?: dayjs.Dayjs | null;
  monday?: boolean | null;
  tuesday?: boolean | null;
  wednesday?: boolean | null;
  thursday?: boolean | null;
  friday?: boolean | null;
  saturday?: boolean | null;
  sunday?: boolean | null;
  morning?: boolean | null;
  afternoon?: boolean | null;
  evening?: boolean | null;
  shop?: Pick<IShop, 'id'> | null;
}

export type NewVolunteerPost = Omit<IVolunteerPost, 'id'> & { id: null };
