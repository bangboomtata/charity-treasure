import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IVolunteerPost } from '../volunteer-post.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../volunteer-post.test-samples';

import { VolunteerPostService, RestVolunteerPost } from './volunteer-post.service';

const requireRestSample: RestVolunteerPost = {
  ...sampleWithRequiredData,
  startDate: sampleWithRequiredData.startDate?.format(DATE_FORMAT),
};

describe('VolunteerPost Service', () => {
  let service: VolunteerPostService;
  let httpMock: HttpTestingController;
  let expectedResult: IVolunteerPost | IVolunteerPost[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(VolunteerPostService);
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

    it('should create a VolunteerPost', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const volunteerPost = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(volunteerPost).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a VolunteerPost', () => {
      const volunteerPost = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(volunteerPost).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a VolunteerPost', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of VolunteerPost', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a VolunteerPost', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addVolunteerPostToCollectionIfMissing', () => {
      it('should add a VolunteerPost to an empty array', () => {
        const volunteerPost: IVolunteerPost = sampleWithRequiredData;
        expectedResult = service.addVolunteerPostToCollectionIfMissing([], volunteerPost);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(volunteerPost);
      });

      it('should not add a VolunteerPost to an array that contains it', () => {
        const volunteerPost: IVolunteerPost = sampleWithRequiredData;
        const volunteerPostCollection: IVolunteerPost[] = [
          {
            ...volunteerPost,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addVolunteerPostToCollectionIfMissing(volunteerPostCollection, volunteerPost);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a VolunteerPost to an array that doesn't contain it", () => {
        const volunteerPost: IVolunteerPost = sampleWithRequiredData;
        const volunteerPostCollection: IVolunteerPost[] = [sampleWithPartialData];
        expectedResult = service.addVolunteerPostToCollectionIfMissing(volunteerPostCollection, volunteerPost);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(volunteerPost);
      });

      it('should add only unique VolunteerPost to an array', () => {
        const volunteerPostArray: IVolunteerPost[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const volunteerPostCollection: IVolunteerPost[] = [sampleWithRequiredData];
        expectedResult = service.addVolunteerPostToCollectionIfMissing(volunteerPostCollection, ...volunteerPostArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const volunteerPost: IVolunteerPost = sampleWithRequiredData;
        const volunteerPost2: IVolunteerPost = sampleWithPartialData;
        expectedResult = service.addVolunteerPostToCollectionIfMissing([], volunteerPost, volunteerPost2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(volunteerPost);
        expect(expectedResult).toContain(volunteerPost2);
      });

      it('should accept null and undefined values', () => {
        const volunteerPost: IVolunteerPost = sampleWithRequiredData;
        expectedResult = service.addVolunteerPostToCollectionIfMissing([], null, volunteerPost, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(volunteerPost);
      });

      it('should return initial array if no VolunteerPost is added', () => {
        const volunteerPostCollection: IVolunteerPost[] = [sampleWithRequiredData];
        expectedResult = service.addVolunteerPostToCollectionIfMissing(volunteerPostCollection, undefined, null);
        expect(expectedResult).toEqual(volunteerPostCollection);
      });
    });

    describe('compareVolunteerPost', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareVolunteerPost(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareVolunteerPost(entity1, entity2);
        const compareResult2 = service.compareVolunteerPost(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareVolunteerPost(entity1, entity2);
        const compareResult2 = service.compareVolunteerPost(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareVolunteerPost(entity1, entity2);
        const compareResult2 = service.compareVolunteerPost(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
