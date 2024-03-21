import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../shop.test-samples';

import { ShopFormService } from './shop-form.service';

describe('Shop Form Service', () => {
  let service: ShopFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopFormService);
  });

  describe('Service methods', () => {
    describe('createShopFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createShopFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shopName: expect.any(Object),
            contactNum: expect.any(Object),
            shopEmail: expect.any(Object),
            charityShopId: expect.any(Object),
            openHoursWeekdays: expect.any(Object),
            openHoursWeekends: expect.any(Object),
            openHoursHolidays: expect.any(Object),
            street: expect.any(Object),
            city: expect.any(Object),
            postCode: expect.any(Object),
            country: expect.any(Object),
            creationDate: expect.any(Object),
            logo: expect.any(Object),
            rating: expect.any(Object),
            distance: expect.any(Object),
            duration: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });

      it('passing IShop should create a new form with FormGroup', () => {
        const formGroup = service.createShopFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            shopName: expect.any(Object),
            contactNum: expect.any(Object),
            shopEmail: expect.any(Object),
            charityShopId: expect.any(Object),
            openHoursWeekdays: expect.any(Object),
            openHoursWeekends: expect.any(Object),
            openHoursHolidays: expect.any(Object),
            street: expect.any(Object),
            city: expect.any(Object),
            postCode: expect.any(Object),
            country: expect.any(Object),
            creationDate: expect.any(Object),
            logo: expect.any(Object),
            rating: expect.any(Object),
            distance: expect.any(Object),
            duration: expect.any(Object),
            user: expect.any(Object),
          })
        );
      });
    });

    describe('getShop', () => {
      it('should return NewShop for default Shop initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createShopFormGroup(sampleWithNewData);

        const shop = service.getShop(formGroup) as any;

        expect(shop).toMatchObject(sampleWithNewData);
      });

      it('should return NewShop for empty Shop initial value', () => {
        const formGroup = service.createShopFormGroup();

        const shop = service.getShop(formGroup) as any;

        expect(shop).toMatchObject({});
      });

      it('should return IShop', () => {
        const formGroup = service.createShopFormGroup(sampleWithRequiredData);

        const shop = service.getShop(formGroup) as any;

        expect(shop).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IShop should not enable id FormControl', () => {
        const formGroup = service.createShopFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewShop should disable id FormControl', () => {
        const formGroup = service.createShopFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
