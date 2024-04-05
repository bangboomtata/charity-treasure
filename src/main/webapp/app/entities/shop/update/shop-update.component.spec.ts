import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ShopFormService } from './shop-form.service';
import { ShopService } from '../service/shop.service';
import { IShop } from '../shop.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';

import { ShopUpdateComponent } from './shop-update.component';

describe('Shop Management Update Component', () => {
  let comp: ShopUpdateComponent;
  let fixture: ComponentFixture<ShopUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let shopFormService: ShopFormService;
  let shopService: ShopService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ShopUpdateComponent],
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
      .overrideTemplate(ShopUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ShopUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    shopFormService = TestBed.inject(ShopFormService);
    shopService = TestBed.inject(ShopService);
    userService = TestBed.inject(UserService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call User query and add missing value', () => {
      const shop: IShop = { id: 456 };
      const user: IUser = { id: 52832 };
      shop.user = user;

      const userCollection: IUser[] = [{ id: 1962 }];
      jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
      const additionalUsers = [user];
      const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
      jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ shop });
      comp.ngOnInit();

      expect(userService.query).toHaveBeenCalled();
      expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(
        userCollection,
        ...additionalUsers.map(expect.objectContaining)
      );
      expect(comp.usersSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const shop: IShop = { id: 456 };
      const user: IUser = { id: 37255 };
      shop.user = user;

      activatedRoute.data = of({ shop });
      comp.ngOnInit();

      expect(comp.usersSharedCollection).toContain(user);
      expect(comp.shop).toEqual(shop);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShop>>();
      const shop = { id: 123 };
      jest.spyOn(shopFormService, 'getShop').mockReturnValue(shop);
      jest.spyOn(shopService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shop });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shop }));
      saveSubject.complete();

      // THEN
      expect(shopFormService.getShop).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(shopService.update).toHaveBeenCalledWith(expect.objectContaining(shop));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShop>>();
      const shop = { id: 123 };
      jest.spyOn(shopFormService, 'getShop').mockReturnValue({ id: null });
      jest.spyOn(shopService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shop: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: shop }));
      saveSubject.complete();

      // THEN
      expect(shopFormService.getShop).toHaveBeenCalled();
      expect(shopService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IShop>>();
      const shop = { id: 123 };
      jest.spyOn(shopService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ shop });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(shopService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareUser', () => {
      it('Should forward to userService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(userService, 'compareUser');
        comp.compareUser(entity, entity2);
        expect(userService.compareUser).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
