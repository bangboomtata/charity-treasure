import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { SSale } from '../item.model';

type SaleFormGroupContent = {
  onlineA: FormControl<SSale['onlineA']>;
  emailA: FormControl<SSale['emailA']>;
  message: FormControl<SSale['message']>;
  timeDays: FormControl<SSale['timeDays']>;
  timeHours: FormControl<SSale['timeHours']>;
  saleAmount: FormControl<SSale['saleAmount']>;
  itemType: FormControl<SSale['itemType']>;
  subCategory: FormArray<FormControl<boolean>>;
  gender: FormControl<SSale['gender']>;
  shop: FormControl<SSale['shop']>;
};

export type SaleFormGroup = FormGroup<SaleFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class SaleFormService {
  createSaleFormGroup(): SaleFormGroup {
    return new FormGroup<SaleFormGroupContent>({
      onlineA: new FormControl(false),
      emailA: new FormControl(false),
      message: new FormControl(''),
      timeDays: new FormControl(null, [Validators.min(0)]),
      timeHours: new FormControl(null, [Validators.min(0), Validators.max(24)]),
      saleAmount: new FormControl(null, [Validators.required, Validators.min(1)]),
      itemType: new FormControl(null, [Validators.required]),
      gender: new FormControl(null),
      subCategory: new FormArray<FormControl<boolean>>([]),
      // this should change to shopID of whoever using form?
      shop: new FormControl(null),
    });
  }

  public addSubCategoryCheckboxes(formGroup: FormGroup, subCategories: string[], selectedSubCategories: string[] = []): void {
    const formArray = formGroup.get('subCategory') as FormArray;
    formArray.clear(); // Clear existing array contents if re-initializing

    subCategories.forEach(subCategory => {
      const isChecked = selectedSubCategories.includes(subCategory); // Determine if the subCategory is selected
      formArray.push(new FormControl(isChecked));
    });
  }

  resetForm(form: SaleFormGroup): void {
    form.reset();
  }
}
