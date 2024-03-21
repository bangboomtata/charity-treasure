import dayjs from 'dayjs/esm';
import { IShop } from 'app/entities/shop/shop.model';
import { Gender } from 'app/entities/enumerations/gender.model';
import { Condition } from 'app/entities/enumerations/condition.model';
import { ItemType } from 'app/entities/enumerations/item-type.model';

export interface IItem {
  id: number;
  price?: number | null;
  saleFlag?: boolean | null;
  saleAmount?: number | null;
  shownPrice?: string | null;
  saleEndTime?: dayjs.Dayjs | null;
  itemName?: string | null;
  itemDescription?: string | null;
  itemAvailability?: boolean | null;
  itemImage?: string | null;
  itemImageContentType?: string | null;
  reserveFlag?: boolean | null;
  gender?: Gender | null;
  condition?: Condition | null;
  itemType?: ItemType | null;
  subCategory?: string | null;
  shop?: Pick<IShop, 'id'> | null;
}

export type NewItem = Omit<IItem, 'id'> & { id: null };
