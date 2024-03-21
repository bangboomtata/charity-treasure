import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../volunteer-post.test-samples';

import { VolunteerPostFormService } from './volunteer-post-form.service';

describe('VolunteerPost Form Service', () => {
  let service: VolunteerPostFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VolunteerPostFormService);
  });

  describe('Service methods', () => {
    describe('createVolunteerPostFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createVolunteerPostFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            postTitle: expect.any(Object),
            locationAddress: expect.any(Object),
            contactNum: expect.any(Object),
            email: expect.any(Object),
            aboutUs: expect.any(Object),
            aboutRole: expect.any(Object),
            benefits: expect.any(Object),
            img: expect.any(Object),
            activeStatus: expect.any(Object),
            startDate: expect.any(Object),
            monday: expect.any(Object),
            tuesday: expect.any(Object),
            wednesday: expect.any(Object),
            thursday: expect.any(Object),
            friday: expect.any(Object),
            saturday: expect.any(Object),
            sunday: expect.any(Object),
            morning: expect.any(Object),
            afternoon: expect.any(Object),
            evening: expect.any(Object),
            shop: expect.any(Object),
          })
        );
      });

      it('passing IVolunteerPost should create a new form with FormGroup', () => {
        const formGroup = service.createVolunteerPostFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            postTitle: expect.any(Object),
            locationAddress: expect.any(Object),
            contactNum: expect.any(Object),
            email: expect.any(Object),
            aboutUs: expect.any(Object),
            aboutRole: expect.any(Object),
            benefits: expect.any(Object),
            img: expect.any(Object),
            activeStatus: expect.any(Object),
            startDate: expect.any(Object),
            monday: expect.any(Object),
            tuesday: expect.any(Object),
            wednesday: expect.any(Object),
            thursday: expect.any(Object),
            friday: expect.any(Object),
            saturday: expect.any(Object),
            sunday: expect.any(Object),
            morning: expect.any(Object),
            afternoon: expect.any(Object),
            evening: expect.any(Object),
            shop: expect.any(Object),
          })
        );
      });
    });

    describe('getVolunteerPost', () => {
      it('should return NewVolunteerPost for default VolunteerPost initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createVolunteerPostFormGroup(sampleWithNewData);

        const volunteerPost = service.getVolunteerPost(formGroup) as any;

        expect(volunteerPost).toMatchObject(sampleWithNewData);
      });

      it('should return NewVolunteerPost for empty VolunteerPost initial value', () => {
        const formGroup = service.createVolunteerPostFormGroup();

        const volunteerPost = service.getVolunteerPost(formGroup) as any;

        expect(volunteerPost).toMatchObject({});
      });

      it('should return IVolunteerPost', () => {
        const formGroup = service.createVolunteerPostFormGroup(sampleWithRequiredData);

        const volunteerPost = service.getVolunteerPost(formGroup) as any;

        expect(volunteerPost).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IVolunteerPost should not enable id FormControl', () => {
        const formGroup = service.createVolunteerPostFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewVolunteerPost should disable id FormControl', () => {
        const formGroup = service.createVolunteerPostFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
