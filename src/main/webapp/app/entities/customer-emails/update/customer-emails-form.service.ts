import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICustomerEmails, NewCustomerEmails } from '../customer-emails.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICustomerEmails for edit and NewCustomerEmailsFormGroupInput for create.
 */
type CustomerEmailsFormGroupInput = ICustomerEmails | PartialWithRequiredKeyOf<NewCustomerEmails>;

type CustomerEmailsFormDefaults = Pick<NewCustomerEmails, 'id'>;

type CustomerEmailsFormGroupContent = {
  id: FormControl<ICustomerEmails['id'] | NewCustomerEmails['id']>;
  email: FormControl<ICustomerEmails['email']>;
  customer: FormControl<ICustomerEmails['customer']>;
};

export type CustomerEmailsFormGroup = FormGroup<CustomerEmailsFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CustomerEmailsFormService {
  createCustomerEmailsFormGroup(customerEmails: CustomerEmailsFormGroupInput = { id: null }): CustomerEmailsFormGroup {
    const customerEmailsRawValue = {
      ...this.getFormDefaults(),
      ...customerEmails,
    };
    return new FormGroup<CustomerEmailsFormGroupContent>({
      id: new FormControl(
        { value: customerEmailsRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      email: new FormControl(customerEmailsRawValue.email),
      customer: new FormControl(customerEmailsRawValue.customer),
    });
  }

  getCustomerEmails(form: CustomerEmailsFormGroup): ICustomerEmails | NewCustomerEmails {
    return form.getRawValue() as ICustomerEmails | NewCustomerEmails;
  }

  resetForm(form: CustomerEmailsFormGroup, customerEmails: CustomerEmailsFormGroupInput): void {
    const customerEmailsRawValue = { ...this.getFormDefaults(), ...customerEmails };
    form.reset(
      {
        ...customerEmailsRawValue,
        id: { value: customerEmailsRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CustomerEmailsFormDefaults {
    return {
      id: null,
    };
  }
}
