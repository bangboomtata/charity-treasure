import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { CustomerEmailsService } from '../service/customer-emails.service';

import { CustomerEmailsComponent } from './customer-emails.component';

describe('CustomerEmails Management Component', () => {
  let comp: CustomerEmailsComponent;
  let fixture: ComponentFixture<CustomerEmailsComponent>;
  let service: CustomerEmailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'customer-emails', component: CustomerEmailsComponent }]), HttpClientTestingModule],
      declarations: [CustomerEmailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(CustomerEmailsComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CustomerEmailsComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(CustomerEmailsService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.customerEmails?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to customerEmailsService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getCustomerEmailsIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getCustomerEmailsIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
