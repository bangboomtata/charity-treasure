import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../application.test-samples';

import { ApplicationFormService } from './application-form.service';

describe('Application Form Service', () => {
  let service: ApplicationFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApplicationFormService);
  });

  describe('Service methods', () => {
    describe('createApplicationFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createApplicationFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            contactNum: expect.any(Object),
            email: expect.any(Object),
            dateOfBirth: expect.any(Object),
            commitmentDuration: expect.any(Object),
            volunteerExperience: expect.any(Object),
            relevantSkills: expect.any(Object),
            motivation: expect.any(Object),
            applicationDate: expect.any(Object),
            applicationStatus: expect.any(Object),
            appliedMonday: expect.any(Object),
            appliedTuesday: expect.any(Object),
            appliedWednesday: expect.any(Object),
            appliedThursday: expect.any(Object),
            appliedFriday: expect.any(Object),
            appliedSaturday: expect.any(Object),
            appliedSunday: expect.any(Object),
            appliedMorning: expect.any(Object),
            appliedAfternoon: expect.any(Object),
            appliedEvening: expect.any(Object),
            post: expect.any(Object),
            customer: expect.any(Object),
          })
        );
      });

      it('passing IApplication should create a new form with FormGroup', () => {
        const formGroup = service.createApplicationFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            firstName: expect.any(Object),
            lastName: expect.any(Object),
            contactNum: expect.any(Object),
            email: expect.any(Object),
            dateOfBirth: expect.any(Object),
            commitmentDuration: expect.any(Object),
            volunteerExperience: expect.any(Object),
            relevantSkills: expect.any(Object),
            motivation: expect.any(Object),
            applicationDate: expect.any(Object),
            applicationStatus: expect.any(Object),
            appliedMonday: expect.any(Object),
            appliedTuesday: expect.any(Object),
            appliedWednesday: expect.any(Object),
            appliedThursday: expect.any(Object),
            appliedFriday: expect.any(Object),
            appliedSaturday: expect.any(Object),
            appliedSunday: expect.any(Object),
            appliedMorning: expect.any(Object),
            appliedAfternoon: expect.any(Object),
            appliedEvening: expect.any(Object),
            post: expect.any(Object),
            customer: expect.any(Object),
          })
        );
      });
    });

    describe('getApplication', () => {
      it('should return NewApplication for default Application initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createApplicationFormGroup(sampleWithNewData);

        const application = service.getApplication(formGroup) as any;

        expect(application).toMatchObject(sampleWithNewData);
      });

      it('should return NewApplication for empty Application initial value', () => {
        const formGroup = service.createApplicationFormGroup();

        const application = service.getApplication(formGroup) as any;

        expect(application).toMatchObject({});
      });

      it('should return IApplication', () => {
        const formGroup = service.createApplicationFormGroup(sampleWithRequiredData);

        const application = service.getApplication(formGroup) as any;

        expect(application).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IApplication should not enable id FormControl', () => {
        const formGroup = service.createApplicationFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewApplication should disable id FormControl', () => {
        const formGroup = service.createApplicationFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
