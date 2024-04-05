import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IShop, NewShop } from '../shop.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IShop for edit and NewShopFormGroupInput for create.
 */
type ShopFormGroupInput = IShop | PartialWithRequiredKeyOf<NewShop>;

type ShopFormDefaults = Pick<NewShop, 'id'>;

type ShopFormGroupContent = {
  id: FormControl<IShop['id'] | NewShop['id']>;
  shopName: FormControl<IShop['shopName']>;
  contactNum: FormControl<IShop['contactNum']>;
  shopEmail: FormControl<IShop['shopEmail']>;
  charityShopId: FormControl<IShop['charityShopId']>;
  openHoursWeekdays: FormControl<IShop['openHoursWeekdays']>;
  openHoursWeekends: FormControl<IShop['openHoursWeekends']>;
  openHoursHolidays: FormControl<IShop['openHoursHolidays']>;
  street: FormControl<IShop['street']>;
  city: FormControl<IShop['city']>;
  postCode: FormControl<IShop['postCode']>;
  country: FormControl<IShop['country']>;
  creationDate: FormControl<IShop['creationDate']>;
  logo: FormControl<IShop['logo']>;
  logoContentType: FormControl<IShop['logoContentType']>;
  rating: FormControl<IShop['rating']>;
  distance: FormControl<IShop['distance']>;
  duration: FormControl<IShop['duration']>;
  user: FormControl<IShop['user']>;
};

export type ShopFormGroup = FormGroup<ShopFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ShopFormService {
  createShopFormGroup(shop: ShopFormGroupInput = { id: null }): ShopFormGroup {
    const shopRawValue = {
      ...this.getFormDefaults(),
      ...shop,
    };
    return new FormGroup<ShopFormGroupContent>({
      id: new FormControl(
        { value: shopRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      shopName: new FormControl(shopRawValue.shopName, {
        validators: [Validators.required],
      }),
      contactNum: new FormControl(shopRawValue.contactNum, {
        validators: [Validators.required],
      }),
      shopEmail: new FormControl(shopRawValue.shopEmail),
      charityShopId: new FormControl(shopRawValue.charityShopId, {
        validators: [Validators.required],
      }),
      openHoursWeekdays: new FormControl(shopRawValue.openHoursWeekdays),
      openHoursWeekends: new FormControl(shopRawValue.openHoursWeekends),
      openHoursHolidays: new FormControl(shopRawValue.openHoursHolidays),
      street: new FormControl(shopRawValue.street),
      city: new FormControl(shopRawValue.city),
      postCode: new FormControl(shopRawValue.postCode),
      country: new FormControl(shopRawValue.country),
      creationDate: new FormControl(shopRawValue.creationDate),
      logo: new FormControl(shopRawValue.logo),
      logoContentType: new FormControl(shopRawValue.logoContentType),
      rating: new FormControl(shopRawValue.rating),
      distance: new FormControl(shopRawValue.distance),
      duration: new FormControl(shopRawValue.duration),
      user: new FormControl(shopRawValue.user),
    });
  }

  getShop(form: ShopFormGroup): IShop | NewShop {
    return form.getRawValue() as IShop | NewShop;
  }

  resetForm(form: ShopFormGroup, shop: ShopFormGroupInput): void {
    const shopRawValue = { ...this.getFormDefaults(), ...shop };
    form.reset(
      {
        ...shopRawValue,
        id: { value: shopRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ShopFormDefaults {
    return {
      id: null,
    };
  }
}
