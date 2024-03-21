import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { FeedbackFormService } from './feedback-form.service';
import { FeedbackService } from '../service/feedback.service';
import { IFeedback } from '../feedback.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';

import { FeedbackUpdateComponent } from './feedback-update.component';

describe('Feedback Management Update Component', () => {
  let comp: FeedbackUpdateComponent;
  let fixture: ComponentFixture<FeedbackUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let feedbackFormService: FeedbackFormService;
  let feedbackService: FeedbackService;
  let customerService: CustomerService;
  let shopService: ShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [FeedbackUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(FeedbackUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(FeedbackUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    feedbackFormService = TestBed.inject(FeedbackFormService);
    feedbackService = TestBed.inject(FeedbackService);
    customerService = TestBed.inject(CustomerService);
    shopService = TestBed.inject(ShopService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Customer query and add missing value', () => {
      const feedback: IFeedback = { id: 456 };
      const customer: ICustomer = { id: 92905 };
      feedback.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 4280 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feedback });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(
        customerCollection,
        ...additionalCustomers.map(expect.objectContaining)
      );
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Shop query and add missing value', () => {
      const feedback: IFeedback = { id: 456 };
      const shop: IShop = { id: 26731 };
      feedback.shop = shop;

      const shopCollection: IShop[] = [{ id: 98690 }];
      jest.spyOn(shopService, 'query').mockReturnValue(of(new HttpResponse({ body: shopCollection })));
      const additionalShops = [shop];
      const expectedCollection: IShop[] = [...additionalShops, ...shopCollection];
      jest.spyOn(shopService, 'addShopToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ feedback });
      comp.ngOnInit();

      expect(shopService.query).toHaveBeenCalled();
      expect(shopService.addShopToCollectionIfMissing).toHaveBeenCalledWith(
        shopCollection,
        ...additionalShops.map(expect.objectContaining)
      );
      expect(comp.shopsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const feedback: IFeedback = { id: 456 };
      const customer: ICustomer = { id: 3034 };
      feedback.customer = customer;
      const shop: IShop = { id: 77774 };
      feedback.shop = shop;

      activatedRoute.data = of({ feedback });
      comp.ngOnInit();

      expect(comp.customersSharedCollection).toContain(customer);
      expect(comp.shopsSharedCollection).toContain(shop);
      expect(comp.feedback).toEqual(feedback);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFeedback>>();
      const feedback = { id: 123 };
      jest.spyOn(feedbackFormService, 'getFeedback').mockReturnValue(feedback);
      jest.spyOn(feedbackService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feedback });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feedback }));
      saveSubject.complete();

      // THEN
      expect(feedbackFormService.getFeedback).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(feedbackService.update).toHaveBeenCalledWith(expect.objectContaining(feedback));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFeedback>>();
      const feedback = { id: 123 };
      jest.spyOn(feedbackFormService, 'getFeedback').mockReturnValue({ id: null });
      jest.spyOn(feedbackService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feedback: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: feedback }));
      saveSubject.complete();

      // THEN
      expect(feedbackFormService.getFeedback).toHaveBeenCalled();
      expect(feedbackService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IFeedback>>();
      const feedback = { id: 123 };
      jest.spyOn(feedbackService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ feedback });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(feedbackService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareCustomer', () => {
      it('Should forward to customerService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(customerService, 'compareCustomer');
        comp.compareCustomer(entity, entity2);
        expect(customerService.compareCustomer).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareShop', () => {
      it('Should forward to shopService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(shopService, 'compareShop');
        comp.compareShop(entity, entity2);
        expect(shopService.compareShop).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
