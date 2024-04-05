import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICustomerEmails } from '../customer-emails.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../customer-emails.test-samples';

import { CustomerEmailsService } from './customer-emails.service';

const requireRestSample: ICustomerEmails = {
  ...sampleWithRequiredData,
};

describe('CustomerEmails Service', () => {
  let service: CustomerEmailsService;
  let httpMock: HttpTestingController;
  let expectedResult: ICustomerEmails | ICustomerEmails[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CustomerEmailsService);
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

    it('should create a CustomerEmails', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const customerEmails = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(customerEmails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a CustomerEmails', () => {
      const customerEmails = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(customerEmails).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a CustomerEmails', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of CustomerEmails', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a CustomerEmails', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCustomerEmailsToCollectionIfMissing', () => {
      it('should add a CustomerEmails to an empty array', () => {
        const customerEmails: ICustomerEmails = sampleWithRequiredData;
        expectedResult = service.addCustomerEmailsToCollectionIfMissing([], customerEmails);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customerEmails);
      });

      it('should not add a CustomerEmails to an array that contains it', () => {
        const customerEmails: ICustomerEmails = sampleWithRequiredData;
        const customerEmailsCollection: ICustomerEmails[] = [
          {
            ...customerEmails,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCustomerEmailsToCollectionIfMissing(customerEmailsCollection, customerEmails);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a CustomerEmails to an array that doesn't contain it", () => {
        const customerEmails: ICustomerEmails = sampleWithRequiredData;
        const customerEmailsCollection: ICustomerEmails[] = [sampleWithPartialData];
        expectedResult = service.addCustomerEmailsToCollectionIfMissing(customerEmailsCollection, customerEmails);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customerEmails);
      });

      it('should add only unique CustomerEmails to an array', () => {
        const customerEmailsArray: ICustomerEmails[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const customerEmailsCollection: ICustomerEmails[] = [sampleWithRequiredData];
        expectedResult = service.addCustomerEmailsToCollectionIfMissing(customerEmailsCollection, ...customerEmailsArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const customerEmails: ICustomerEmails = sampleWithRequiredData;
        const customerEmails2: ICustomerEmails = sampleWithPartialData;
        expectedResult = service.addCustomerEmailsToCollectionIfMissing([], customerEmails, customerEmails2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(customerEmails);
        expect(expectedResult).toContain(customerEmails2);
      });

      it('should accept null and undefined values', () => {
        const customerEmails: ICustomerEmails = sampleWithRequiredData;
        expectedResult = service.addCustomerEmailsToCollectionIfMissing([], null, customerEmails, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(customerEmails);
      });

      it('should return initial array if no CustomerEmails is added', () => {
        const customerEmailsCollection: ICustomerEmails[] = [sampleWithRequiredData];
        expectedResult = service.addCustomerEmailsToCollectionIfMissing(customerEmailsCollection, undefined, null);
        expect(expectedResult).toEqual(customerEmailsCollection);
      });
    });

    describe('compareCustomerEmails', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCustomerEmails(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCustomerEmails(entity1, entity2);
        const compareResult2 = service.compareCustomerEmails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCustomerEmails(entity1, entity2);
        const compareResult2 = service.compareCustomerEmails(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCustomerEmails(entity1, entity2);
        const compareResult2 = service.compareCustomerEmails(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
