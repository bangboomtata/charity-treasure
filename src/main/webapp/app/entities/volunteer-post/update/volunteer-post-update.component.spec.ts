import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { VolunteerPostFormService } from './volunteer-post-form.service';
import { VolunteerPostService } from '../service/volunteer-post.service';
import { IVolunteerPost } from '../volunteer-post.model';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';

import { VolunteerPostUpdateComponent } from './volunteer-post-update.component';

describe('VolunteerPost Management Update Component', () => {
  let comp: VolunteerPostUpdateComponent;
  let fixture: ComponentFixture<VolunteerPostUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let volunteerPostFormService: VolunteerPostFormService;
  let volunteerPostService: VolunteerPostService;
  let shopService: ShopService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [VolunteerPostUpdateComponent],
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
      .overrideTemplate(VolunteerPostUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(VolunteerPostUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    volunteerPostFormService = TestBed.inject(VolunteerPostFormService);
    volunteerPostService = TestBed.inject(VolunteerPostService);
    shopService = TestBed.inject(ShopService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Shop query and add missing value', () => {
      const volunteerPost: IVolunteerPost = { id: 456 };
      const shop: IShop = { id: 29080 };
      volunteerPost.shop = shop;

      const shopCollection: IShop[] = [{ id: 44806 }];
      jest.spyOn(shopService, 'query').mockReturnValue(of(new HttpResponse({ body: shopCollection })));
      const additionalShops = [shop];
      const expectedCollection: IShop[] = [...additionalShops, ...shopCollection];
      jest.spyOn(shopService, 'addShopToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ volunteerPost });
      comp.ngOnInit();

      expect(shopService.query).toHaveBeenCalled();
      expect(shopService.addShopToCollectionIfMissing).toHaveBeenCalledWith(
        shopCollection,
        ...additionalShops.map(expect.objectContaining)
      );
      expect(comp.shopsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const volunteerPost: IVolunteerPost = { id: 456 };
      const shop: IShop = { id: 6882 };
      volunteerPost.shop = shop;

      activatedRoute.data = of({ volunteerPost });
      comp.ngOnInit();

      expect(comp.shopsSharedCollection).toContain(shop);
      expect(comp.volunteerPost).toEqual(volunteerPost);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVolunteerPost>>();
      const volunteerPost = { id: 123 };
      jest.spyOn(volunteerPostFormService, 'getVolunteerPost').mockReturnValue(volunteerPost);
      jest.spyOn(volunteerPostService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ volunteerPost });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: volunteerPost }));
      saveSubject.complete();

      // THEN
      expect(volunteerPostFormService.getVolunteerPost).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(volunteerPostService.update).toHaveBeenCalledWith(expect.objectContaining(volunteerPost));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVolunteerPost>>();
      const volunteerPost = { id: 123 };
      jest.spyOn(volunteerPostFormService, 'getVolunteerPost').mockReturnValue({ id: null });
      jest.spyOn(volunteerPostService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ volunteerPost: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: volunteerPost }));
      saveSubject.complete();

      // THEN
      expect(volunteerPostFormService.getVolunteerPost).toHaveBeenCalled();
      expect(volunteerPostService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IVolunteerPost>>();
      const volunteerPost = { id: 123 };
      jest.spyOn(volunteerPostService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ volunteerPost });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(volunteerPostService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
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
