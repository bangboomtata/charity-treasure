import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { InterestedEventsFormService } from './interested-events-form.service';
import { InterestedEventsService } from '../service/interested-events.service';
import { IInterestedEvents } from '../interested-events.model';
import { ICustomer } from 'app/entities/customer/customer.model';
import { CustomerService } from 'app/entities/customer/service/customer.service';
import { IEvent } from 'app/entities/event/event.model';
import { EventService } from 'app/entities/event/service/event.service';

import { InterestedEventsUpdateComponent } from './interested-events-update.component';

describe('InterestedEvents Management Update Component', () => {
  let comp: InterestedEventsUpdateComponent;
  let fixture: ComponentFixture<InterestedEventsUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let interestedEventsFormService: InterestedEventsFormService;
  let interestedEventsService: InterestedEventsService;
  let customerService: CustomerService;
  let eventService: EventService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [InterestedEventsUpdateComponent],
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
      .overrideTemplate(InterestedEventsUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(InterestedEventsUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    interestedEventsFormService = TestBed.inject(InterestedEventsFormService);
    interestedEventsService = TestBed.inject(InterestedEventsService);
    customerService = TestBed.inject(CustomerService);
    eventService = TestBed.inject(EventService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Customer query and add missing value', () => {
      const interestedEvents: IInterestedEvents = { id: 456 };
      const user: ICustomer = { id: 93225 };
      interestedEvents.user = user;

      const customerCollection: ICustomer[] = [{ id: 54270 }];
      jest.spyOn(customerService, 'query').mockReturnValue(of(new HttpResponse({ body: customerCollection })));
      const additionalCustomers = [user];
      const expectedCollection: ICustomer[] = [...additionalCustomers, ...customerCollection];
      jest.spyOn(customerService, 'addCustomerToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ interestedEvents });
      comp.ngOnInit();

      expect(customerService.query).toHaveBeenCalled();
      expect(customerService.addCustomerToCollectionIfMissing).toHaveBeenCalledWith(
        customerCollection,
        ...additionalCustomers.map(expect.objectContaining)
      );
      expect(comp.customersSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Event query and add missing value', () => {
      const interestedEvents: IInterestedEvents = { id: 456 };
      const event: IEvent = { id: 66635 };
      interestedEvents.event = event;

      const eventCollection: IEvent[] = [{ id: 64145 }];
      jest.spyOn(eventService, 'query').mockReturnValue(of(new HttpResponse({ body: eventCollection })));
      const additionalEvents = [event];
      const expectedCollection: IEvent[] = [...additionalEvents, ...eventCollection];
      jest.spyOn(eventService, 'addEventToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ interestedEvents });
      comp.ngOnInit();

      expect(eventService.query).toHaveBeenCalled();
      expect(eventService.addEventToCollectionIfMissing).toHaveBeenCalledWith(
        eventCollection,
        ...additionalEvents.map(expect.objectContaining)
      );
      expect(comp.eventsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const interestedEvents: IInterestedEvents = { id: 456 };
      const user: ICustomer = { id: 75507 };
      interestedEvents.user = user;
      const event: IEvent = { id: 40686 };
      interestedEvents.event = event;

      activatedRoute.data = of({ interestedEvents });
      comp.ngOnInit();

      expect(comp.customersSharedCollection).toContain(user);
      expect(comp.eventsSharedCollection).toContain(event);
      expect(comp.interestedEvents).toEqual(interestedEvents);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInterestedEvents>>();
      const interestedEvents = { id: 123 };
      jest.spyOn(interestedEventsFormService, 'getInterestedEvents').mockReturnValue(interestedEvents);
      jest.spyOn(interestedEventsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ interestedEvents });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: interestedEvents }));
      saveSubject.complete();

      // THEN
      expect(interestedEventsFormService.getInterestedEvents).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(interestedEventsService.update).toHaveBeenCalledWith(expect.objectContaining(interestedEvents));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInterestedEvents>>();
      const interestedEvents = { id: 123 };
      jest.spyOn(interestedEventsFormService, 'getInterestedEvents').mockReturnValue({ id: null });
      jest.spyOn(interestedEventsService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ interestedEvents: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: interestedEvents }));
      saveSubject.complete();

      // THEN
      expect(interestedEventsFormService.getInterestedEvents).toHaveBeenCalled();
      expect(interestedEventsService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IInterestedEvents>>();
      const interestedEvents = { id: 123 };
      jest.spyOn(interestedEventsService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ interestedEvents });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(interestedEventsService.update).toHaveBeenCalled();
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

    describe('compareEvent', () => {
      it('Should forward to eventService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(eventService, 'compareEvent');
        comp.compareEvent(entity, entity2);
        expect(eventService.compareEvent).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
