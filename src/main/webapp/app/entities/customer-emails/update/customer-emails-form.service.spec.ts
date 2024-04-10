import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../customer-emails.test-samples';

import { CustomerEmailsFormService } from './customer-emails-form.service';

describe('CustomerEmails Form Service', () => {
  let service: CustomerEmailsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomerEmailsFormService);
  });

  describe('Service methods', () => {
    describe('createCustomerEmailsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCustomerEmailsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            email: expect.any(Object),
            customer: expect.any(Object),
          })
        );
      });

      it('passing ICustomerEmails should create a new form with FormGroup', () => {
        const formGroup = service.createCustomerEmailsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            email: expect.any(Object),
            customer: expect.any(Object),
          })
        );
      });
    });

    describe('getCustomerEmails', () => {
      it('should return NewCustomerEmails for default CustomerEmails initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCustomerEmailsFormGroup(sampleWithNewData);

        const customerEmails = service.getCustomerEmails(formGroup) as any;

        expect(customerEmails).toMatchObject(sampleWithNewData);
      });

      it('should return NewCustomerEmails for empty CustomerEmails initial value', () => {
        const formGroup = service.createCustomerEmailsFormGroup();

        const customerEmails = service.getCustomerEmails(formGroup) as any;

        expect(customerEmails).toMatchObject({});
      });

      it('should return ICustomerEmails', () => {
        const formGroup = service.createCustomerEmailsFormGroup(sampleWithRequiredData);

        const customerEmails = service.getCustomerEmails(formGroup) as any;

        expect(customerEmails).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICustomerEmails should not enable id FormControl', () => {
        const formGroup = service.createCustomerEmailsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCustomerEmails should disable id FormControl', () => {
        const formGroup = service.createCustomerEmailsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
