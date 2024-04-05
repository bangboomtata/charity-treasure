import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { DATE_FORMAT } from 'app/config/input.constants';
import { IShop } from '../shop.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../shop.test-samples';

import { ShopService, RestShop } from './shop.service';

const requireRestSample: RestShop = {
  ...sampleWithRequiredData,
  creationDate: sampleWithRequiredData.creationDate?.format(DATE_FORMAT),
};

describe('Shop Service', () => {
  let service: ShopService;
  let httpMock: HttpTestingController;
  let expectedResult: IShop | IShop[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(ShopService);
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

    it('should create a Shop', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const shop = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(shop).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Shop', () => {
      const shop = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(shop).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Shop', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Shop', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Shop', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addShopToCollectionIfMissing', () => {
      it('should add a Shop to an empty array', () => {
        const shop: IShop = sampleWithRequiredData;
        expectedResult = service.addShopToCollectionIfMissing([], shop);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shop);
      });

      it('should not add a Shop to an array that contains it', () => {
        const shop: IShop = sampleWithRequiredData;
        const shopCollection: IShop[] = [
          {
            ...shop,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addShopToCollectionIfMissing(shopCollection, shop);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Shop to an array that doesn't contain it", () => {
        const shop: IShop = sampleWithRequiredData;
        const shopCollection: IShop[] = [sampleWithPartialData];
        expectedResult = service.addShopToCollectionIfMissing(shopCollection, shop);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shop);
      });

      it('should add only unique Shop to an array', () => {
        const shopArray: IShop[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const shopCollection: IShop[] = [sampleWithRequiredData];
        expectedResult = service.addShopToCollectionIfMissing(shopCollection, ...shopArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const shop: IShop = sampleWithRequiredData;
        const shop2: IShop = sampleWithPartialData;
        expectedResult = service.addShopToCollectionIfMissing([], shop, shop2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(shop);
        expect(expectedResult).toContain(shop2);
      });

      it('should accept null and undefined values', () => {
        const shop: IShop = sampleWithRequiredData;
        expectedResult = service.addShopToCollectionIfMissing([], null, shop, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(shop);
      });

      it('should return initial array if no Shop is added', () => {
        const shopCollection: IShop[] = [sampleWithRequiredData];
        expectedResult = service.addShopToCollectionIfMissing(shopCollection, undefined, null);
        expect(expectedResult).toEqual(shopCollection);
      });
    });

    describe('compareShop', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareShop(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareShop(entity1, entity2);
        const compareResult2 = service.compareShop(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareShop(entity1, entity2);
        const compareResult2 = service.compareShop(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareShop(entity1, entity2);
        const compareResult2 = service.compareShop(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
