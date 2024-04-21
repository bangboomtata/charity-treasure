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
  shop?: Pick<IShop, 'id' | 'logo' | 'logoContentType' | 'shopName' | 'rating'> | null;
}

export interface SSale {
  onlineA?: boolean | null;
  emailA?: boolean | null;
  message?: string | null;
  timeDays?: number | null;
  timeHours?: number | null;
  saleAmount?: number | null;
  itemType?: ItemType | null;
  subCategory?: string[] | null;
  gender?: Gender | null;
  shop?: Pick<IShop, 'id'> | null;
}

export type NewItem = Omit<IItem, 'id'> & { id: null };

export type SubCategoryOptions = {
  [K in ItemType]: K extends ItemType.CLOTHING ? { [G in Gender]: string[] } : string[];
};

export const subCategoryOptions: SubCategoryOptions = {
  [ItemType.CLOTHING]: {
    [Gender.MALE]: ['Jeans & Trousers', 'Shirts & Tops', 'Suits & Sets', 'Accessories'],
    [Gender.FEMALE]: ['Dresses', 'Jeans', 'Jumpsuits & Playsuits', 'Shirts & Blouses', 'Skirts', 'Trousers and Leggings'],
    [Gender.UNISEX]: ['Accessories', 'Coats & Jackets', 'Hoodies & Sweatshirts', 'Jumpsuits & Dungarees', 'Knitwear', 'Shoes & Boots'],
  },
  [ItemType.TOY]: ['Board Games', 'Dolls & Soft Toys', 'Jigsaws', 'Models', 'Action Figures'],
  [ItemType.BOOK]: [
    'Art & Photography',
    'Academic',
    'Biographies',
    'History',
    'Non-Fiction',
    'Fiction',
    'Children',
    'Comic & Graphic Novels',
  ],
  [ItemType.HOMEWARE]: ['Antiques', 'Ceramic', 'Glassware', 'Metalware', 'Sewing, Knitting', 'Silverware'],
  [ItemType.ENTERTAINMENT]: ['CDs', 'DVD', 'Bluray', 'Cassette', 'Vinyl', 'Video Games'],
};
