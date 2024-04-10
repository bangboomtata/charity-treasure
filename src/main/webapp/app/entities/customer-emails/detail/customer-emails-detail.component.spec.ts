import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CustomerEmailsDetailComponent } from './customer-emails-detail.component';

describe('CustomerEmails Management Detail Component', () => {
  let comp: CustomerEmailsDetailComponent;
  let fixture: ComponentFixture<CustomerEmailsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerEmailsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ customerEmails: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(CustomerEmailsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(CustomerEmailsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load customerEmails on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.customerEmails).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
