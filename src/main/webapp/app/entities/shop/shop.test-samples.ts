import dayjs from 'dayjs/esm';

import { IShop, NewShop } from './shop.model';

export const sampleWithRequiredData: IShop = {
  id: 48325,
  shopName: 'Carolina Plaza',
  contactNum: 'Senior',
  charityShopId: 'JSON green UIC-Franc',
};

export const sampleWithPartialData: IShop = {
  id: 31152,
  shopName: 'parsing',
  contactNum: 'lime compress',
  shopEmail: 'Gorgeous Berkshire Vietnam',
  charityShopId: 'Beauty Berkshire',
  city: 'Port Myrtie',
  postCode: '45127',
  country: 'Faroe Islands',
  logo: '../fake-data/blob/hipster.png',
  logoContentType: 'unknown',
  rating: 78870,
  distance: 65141,
  duration: '98432',
};

export const sampleWithFullData: IShop = {
  id: 82601,
  shopName: 'Extended',
  contactNum: 'contingency enhance User-centric',
  shopEmail: 'Hat Front-line',
  charityShopId: 'AGP',
  openHoursWeekdays: 'Health States Hong',
  openHoursWeekends: 'ROI generating Future',
  openHoursHolidays: 'Dalasi',
  street: 'Padberg Place',
  city: 'Nathanielhaven',
  postCode: '40694-2623',
  country: 'Switzerland',
  creationDate: dayjs('2024-03-21'),
  logo: '../fake-data/blob/hipster.png',
  logoContentType: 'unknown',
  rating: 2857,
  distance: 12473,
  duration: '95800',
};

export const sampleWithNewData: NewShop = {
  shopName: 'Buckinghamshire Account',
  contactNum: 'THX Account Nebraska',
  charityShopId: 'Account',
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
