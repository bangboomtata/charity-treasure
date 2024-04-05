import dayjs from 'dayjs/esm';

import { Gender } from 'app/entities/enumerations/gender.model';
import { Condition } from 'app/entities/enumerations/condition.model';
import { ItemType } from 'app/entities/enumerations/item-type.model';

import { IItem, NewItem } from './item.model';

export const sampleWithRequiredData: IItem = {
  id: 89800,
  price: 51376,
  itemName: 'utilisation matrix',
  itemImage: '../fake-data/blob/hipster.png',
  itemImageContentType: 'unknown',
  condition: Condition['GOOD'],
  itemType: ItemType['ENTERTAINMENT'],
  subCategory: 'mobile Account',
};

export const sampleWithPartialData: IItem = {
  id: 88804,
  price: 26180,
  saleEndTime: dayjs('2024-04-04T17:53'),
  itemName: 'next-generation',
  itemImage: '../fake-data/blob/hipster.png',
  itemImageContentType: 'unknown',
  reserveFlag: false,
  gender: Gender['UNISEX'],
  condition: Condition['GOOD'],
  itemType: ItemType['ENTERTAINMENT'],
  subCategory: 'harness',
};

export const sampleWithFullData: IItem = {
  id: 35643,
  price: 12587,
  saleFlag: false,
  saleAmount: 79,
  shownPrice: 'Malaysian methodical',
  saleEndTime: dayjs('2024-04-04T14:51'),
  itemName: 'Riel Developer multi-state',
  itemDescription: 'bypassing Marketing',
  itemAvailability: true,
  itemImage: '../fake-data/blob/hipster.png',
  itemImageContentType: 'unknown',
  reserveFlag: true,
  gender: Gender['FEMALE'],
  condition: Condition['VERYGOOD'],
  itemType: ItemType['TOY'],
  subCategory: 'Keyboard Rubber',
};

export const sampleWithNewData: NewItem = {
  price: 19660,
  itemName: 'Estate Concrete',
  itemImage: '../fake-data/blob/hipster.png',
  itemImageContentType: 'unknown',
  condition: Condition['VERYGOOD'],
  itemType: ItemType['CLOTHING'],
  subCategory: 'Dynamic',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
