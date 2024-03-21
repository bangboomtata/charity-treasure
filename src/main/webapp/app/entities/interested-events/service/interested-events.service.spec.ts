import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IInterestedEvents } from '../interested-events.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../interested-events.test-samples';

import { InterestedEventsService } from './interested-events.service';

const requireRestSample: IInterestedEvents = {
  ...sampleWithRequiredData,
};

describe('InterestedEvents Service', () => {
  let service: InterestedEventsService;
  let httpMock: HttpTestingController;
  let expectedResult: IInterestedEvents | IInterestedEvents[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(InterestedEventsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a InterestedEvents', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const interestedEvents = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(interestedEvents).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a InterestedEvents', () => {
      const interestedEvents = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(interestedEvents).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a InterestedEvents', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of InterestedEvents', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a InterestedEvents', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addInterestedEventsToCollectionIfMissing', () => {
      it('should add a InterestedEvents to an empty array', () => {
        const interestedEvents: IInterestedEvents = sampleWithRequiredData;
        expectedResult = service.addInterestedEventsToCollectionIfMissing([], interestedEvents);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(interestedEvents);
      });

      it('should not add a InterestedEvents to an array that contains it', () => {
        const interestedEvents: IInterestedEvents = sampleWithRequiredData;
        const interestedEventsCollection: IInterestedEvents[] = [
          {
            ...interestedEvents,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addInterestedEventsToCollectionIfMissing(interestedEventsCollection, interestedEvents);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a InterestedEvents to an array that doesn't contain it", () => {
        const interestedEvents: IInterestedEvents = sampleWithRequiredData;
        const interestedEventsCollection: IInterestedEvents[] = [sampleWithPartialData];
        expectedResult = service.addInterestedEventsToCollectionIfMissing(interestedEventsCollection, interestedEvents);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(interestedEvents);
      });

      it('should add only unique InterestedEvents to an array', () => {
        const interestedEventsArray: IInterestedEvents[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const interestedEventsCollection: IInterestedEvents[] = [sampleWithRequiredData];
        expectedResult = service.addInterestedEventsToCollectionIfMissing(interestedEventsCollection, ...interestedEventsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const interestedEvents: IInterestedEvents = sampleWithRequiredData;
        const interestedEvents2: IInterestedEvents = sampleWithPartialData;
        expectedResult = service.addInterestedEventsToCollectionIfMissing([], interestedEvents, interestedEvents2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(interestedEvents);
        expect(expectedResult).toContain(interestedEvents2);
      });

      it('should accept null and undefined values', () => {
        const interestedEvents: IInterestedEvents = sampleWithRequiredData;
        expectedResult = service.addInterestedEventsToCollectionIfMissing([], null, interestedEvents, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(interestedEvents);
      });

      it('should return initial array if no InterestedEvents is added', () => {
        const interestedEventsCollection: IInterestedEvents[] = [sampleWithRequiredData];
        expectedResult = service.addInterestedEventsToCollectionIfMissing(interestedEventsCollection, undefined, null);
        expect(expectedResult).toEqual(interestedEventsCollection);
      });
    });

    describe('compareInterestedEvents', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareInterestedEvents(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareInterestedEvents(entity1, entity2);
        const compareResult2 = service.compareInterestedEvents(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareInterestedEvents(entity1, entity2);
        const compareResult2 = service.compareInterestedEvents(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareInterestedEvents(entity1, entity2);
        const compareResult2 = service.compareInterestedEvents(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
