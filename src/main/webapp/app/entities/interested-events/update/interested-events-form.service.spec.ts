import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../interested-events.test-samples';

import { InterestedEventsFormService } from './interested-events-form.service';

describe('InterestedEvents Form Service', () => {
  let service: InterestedEventsFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterestedEventsFormService);
  });

  describe('Service methods', () => {
    describe('createInterestedEventsFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createInterestedEventsFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user: expect.any(Object),
            event: expect.any(Object),
          })
        );
      });

      it('passing IInterestedEvents should create a new form with FormGroup', () => {
        const formGroup = service.createInterestedEventsFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            user: expect.any(Object),
            event: expect.any(Object),
          })
        );
      });
    });

    describe('getInterestedEvents', () => {
      it('should return NewInterestedEvents for default InterestedEvents initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createInterestedEventsFormGroup(sampleWithNewData);

        const interestedEvents = service.getInterestedEvents(formGroup) as any;

        expect(interestedEvents).toMatchObject(sampleWithNewData);
      });

      it('should return NewInterestedEvents for empty InterestedEvents initial value', () => {
        const formGroup = service.createInterestedEventsFormGroup();

        const interestedEvents = service.getInterestedEvents(formGroup) as any;

        expect(interestedEvents).toMatchObject({});
      });

      it('should return IInterestedEvents', () => {
        const formGroup = service.createInterestedEventsFormGroup(sampleWithRequiredData);

        const interestedEvents = service.getInterestedEvents(formGroup) as any;

        expect(interestedEvents).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IInterestedEvents should not enable id FormControl', () => {
        const formGroup = service.createInterestedEventsFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewInterestedEvents should disable id FormControl', () => {
        const formGroup = service.createInterestedEventsFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
