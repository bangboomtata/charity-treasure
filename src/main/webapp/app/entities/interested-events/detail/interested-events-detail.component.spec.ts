import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { InterestedEventsDetailComponent } from './interested-events-detail.component';

describe('InterestedEvents Management Detail Component', () => {
  let comp: InterestedEventsDetailComponent;
  let fixture: ComponentFixture<InterestedEventsDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InterestedEventsDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ interestedEvents: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(InterestedEventsDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(InterestedEventsDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load interestedEvents on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.interestedEvents).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
