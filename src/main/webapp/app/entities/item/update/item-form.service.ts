import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IItem, NewItem } from '../item.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IItem for edit and NewItemFormGroupInput for create.
 */
type ItemFormGroupInput = IItem | PartialWithRequiredKeyOf<NewItem>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IItem | NewItem> = Omit<T, 'saleEndTime'> & {
  saleEndTime?: string | null;
};

type ItemFormRawValue = FormValueOf<IItem>;

type NewItemFormRawValue = FormValueOf<NewItem>;

type ItemFormDefaults = Pick<NewItem, 'id' | 'saleFlag' | 'saleEndTime' | 'itemAvailability' | 'reserveFlag'>;

type ItemFormGroupContent = {
  id: FormControl<ItemFormRawValue['id'] | NewItem['id']>;
  price: FormControl<ItemFormRawValue['price']>;
  saleFlag: FormControl<ItemFormRawValue['saleFlag']>;
  saleAmount: FormControl<ItemFormRawValue['saleAmount']>;
  shownPrice: FormControl<ItemFormRawValue['shownPrice']>;
  saleEndTime: FormControl<ItemFormRawValue['saleEndTime']>;
  itemName: FormControl<ItemFormRawValue['itemName']>;
  itemDescription: FormControl<ItemFormRawValue['itemDescription']>;
  itemAvailability: FormControl<ItemFormRawValue['itemAvailability']>;
  itemImage: FormControl<ItemFormRawValue['itemImage']>;
  itemImageContentType: FormControl<ItemFormRawValue['itemImageContentType']>;
  reserveFlag: FormControl<ItemFormRawValue['reserveFlag']>;
  gender: FormControl<ItemFormRawValue['gender']>;
  condition: FormControl<ItemFormRawValue['condition']>;
  itemType: FormControl<ItemFormRawValue['itemType']>;
  subCategory: FormControl<ItemFormRawValue['subCategory']>;
  shop: FormControl<ItemFormRawValue['shop']>;
};

export type ItemFormGroup = FormGroup<ItemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ItemFormService {
  createItemFormGroup(item: ItemFormGroupInput = { id: null }): ItemFormGroup {
    const itemRawValue = this.convertItemToItemRawValue({
      ...this.getFormDefaults(),
      ...item,
    });
    const formGroup = new FormGroup<ItemFormGroupContent>({
      id: new FormControl(
        { value: itemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      price: new FormControl(itemRawValue.price || 0, {
        validators: [Validators.required],
      }),
      saleFlag: new FormControl({ value: false, disabled: true }),
      saleAmount: new FormControl(itemRawValue.saleAmount, {
        validators: [Validators.min(10), Validators.max(90)],
      }),
      shownPrice: new FormControl(String(itemRawValue.price)),
      saleEndTime: new FormControl({ value: null, disabled: true }),
      itemName: new FormControl(itemRawValue.itemName, {
        validators: [Validators.required],
      }),
      itemDescription: new FormControl(itemRawValue.itemDescription),
      itemAvailability: new FormControl({ value: true, disabled: true }),
      itemImage: new FormControl(itemRawValue.itemImage, {
        validators: [Validators.required],
      }),
      itemImageContentType: new FormControl(itemRawValue.itemImageContentType),
      reserveFlag: new FormControl({ value: false, disabled: true }),
      gender: new FormControl(itemRawValue.gender),
      condition: new FormControl(itemRawValue.condition, {
        validators: [Validators.required],
      }),
      itemType: new FormControl(itemRawValue.itemType, {
        validators: [Validators.required],
      }),
      subCategory: new FormControl(itemRawValue.subCategory, {
        validators: [Validators.required],
      }),
      shop: new FormControl(itemRawValue.shop),
    });
    const priceControl = formGroup.get('price');
    if (priceControl) {
      priceControl.valueChanges.subscribe(value => {
        const shownPriceControl = formGroup.get('shownPrice');
        if (shownPriceControl) {
          shownPriceControl.setValue(String(value || ''), { emitEvent: false });
        }
      });
    }
    return formGroup;
  }

  getItem(form: ItemFormGroup): IItem | NewItem {
    return this.convertItemRawValueToItem(form.getRawValue() as ItemFormRawValue | NewItemFormRawValue);
  }

  resetForm(form: ItemFormGroup, item: ItemFormGroupInput): void {
    const itemRawValue = this.convertItemToItemRawValue({ ...this.getFormDefaults(), ...item });
    form.reset(
      {
        ...itemRawValue,
        id: { value: itemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ItemFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      saleFlag: false,
      saleEndTime: currentTime,
      itemAvailability: false,
      reserveFlag: false,
    };
  }

  private convertItemRawValueToItem(rawItem: ItemFormRawValue | NewItemFormRawValue): IItem | NewItem {
    return {
      ...rawItem,
      saleEndTime: dayjs(rawItem.saleEndTime, DATE_TIME_FORMAT),
    };
  }

  private convertItemToItemRawValue(
    item: IItem | (Partial<NewItem> & ItemFormDefaults)
  ): ItemFormRawValue | PartialWithRequiredKeyOf<NewItemFormRawValue> {
    return {
      ...item,
      saleEndTime: item.saleEndTime ? item.saleEndTime.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
