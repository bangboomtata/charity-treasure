import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CustomerEmailsFormService } from './customer-emails-form.service';
import { CustomerEmailsService } from '../service/customer-emails.service';
import { ICustomerEmails } from '../customer-emails.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';

import { CustomerEmailsUpdateComponent } from './customer-emails-update.component';

describe('CustomerEmails Management Update Component', () => {
  let comp: CustomerEmailsUpdateComponent;
  let fixture: ComponentFixture<CustomerEmailsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let customerEmailsFormService: CustomerEmailsFormService;
  let customerEmailsService: CustomerEmailsService;
  let customerService: CustomerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CustomerEmailsUpdateComponent],
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
      .overrideTemplate(CustomerEmailsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerEmailsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    customerEmailsFormService = TestBed.inject(CustomerEmailsFormService);
    customerEmailsService = TestBed.inject(CustomerEmailsService);
    customerService = TestBed.inject(CustomerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Customer query and add missing value', () => {
      const customerEmails: ICustomerEmails = { id: 456 };
      const customer: ICustomer = { id: 75745 };
      customerEmails.customer = customer;

      const customerCollection: ICustomer[] = [{ id: 94782 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [customer];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ customerEmails });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(
        customerCollection,
        ...additionalCustomers.map(expect.objectContaining)
      );
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const customerEmails: ICustomerEmails = { id: 456 };
      const customer: ICustomer = { id: 48670 };
      customerEmails.customer = customer;

      activatedRoute.data = of({ customerEmails });
      comp.ngOnInit();

      expect(comp.customersSharedCollection).toContain(customer);
      expect(comp.customerEmails).toEqual(customerEmails);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomerEmails>>();
      const customerEmails = { id: 123 };
      jest.spyOn(customerEmailsFormService, 'getCustomerEmails').mockReturnValue(customerEmails);
      jest.spyOn(customerEmailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerEmails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customerEmails }));
      saveSubject.complete();

      // THEN
      expect(customerEmailsFormService.getCustomerEmails).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(customerEmailsService.update).toHaveBeenCalledWith(expect.objectContaining(customerEmails));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomerEmails>>();
      const customerEmails = { id: 123 };
      jest.spyOn(customerEmailsFormService, 'getCustomerEmails').mockReturnValue({ id: null });
      jest.spyOn(customerEmailsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerEmails: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: customerEmails }));
      saveSubject.complete();

      // THEN
      expect(customerEmailsFormService.getCustomerEmails).toHaveBeenCalled();
      expect(customerEmailsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICustomerEmails>>();
      const customerEmails = { id: 123 };
      jest.spyOn(customerEmailsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ customerEmails });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(customerEmailsService.update).toHaveBeenCalled();
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
  });
});
