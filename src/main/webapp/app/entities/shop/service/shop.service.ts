import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IShop, NewShop } from '../shop.model';
import { SShop } from 'app/account/register/register.component';
import { AccountService } from 'app/core/auth/account.service';

export type PartialUpdateShop = Partial<IShop> & Pick<IShop, 'id'>;

type RestOf<T extends IShop | NewShop> = Omit<T, 'creationDate'> & {
  creationDate?: string | null;
};

export type RestShop = RestOf<IShop>;

export type NewRestShop = RestOf<NewShop>;

export type PartialUpdateRestShop = RestOf<PartialUpdateShop>;

export type EntityResponseType = HttpResponse<IShop>;
export type EntityArrayResponseType = HttpResponse<IShop[]>;

@Injectable({ providedIn: 'root' })
export class ShopService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/shops');

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected accountService: AccountService
  ) {}

  getAllShops(): Observable<IShop[]> {
    // Assuming your API endpoint for getting all shops is '/api/shops'
    return this.http.get<IShop[]>('/api/shops');
  }

  getAllShopUserIds(): Observable<number[]> {
    return this.getAllShops().pipe(
      map(shops => shops.map(shop => shop.user?.id).filter((userId): userId is number => typeof userId === 'number'))
    );
  }

  getLoginsForShopUsers(): Observable<(string | null | undefined)[]> {
    return this.getAllShopUserIds().pipe(
      mergeMap(userIds => {
        const requests: Observable<string | null | undefined>[] = [];
        for (const userId of userIds) {
          requests.push(this.accountService.getLoginByUserId(userId));
        }
        return forkJoin(requests);
      })
    );
  }

  create(shop: NewShop): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shop);
    return this.http.post<RestShop>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  createShop(shop: SShop): Observable<EntityResponseType> {
    return this.http.post<RestShop>(this.resourceUrl, shop, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(shop: IShop): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shop);
    return this.http
      .put<RestShop>(`${this.resourceUrl}/${this.getShopIdentifier(shop)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(shop: PartialUpdateShop): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(shop);
    return this.http
      .patch<RestShop>(`${this.resourceUrl}/${this.getShopIdentifier(shop)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestShop>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestShop[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getShopIdentifier(shop: Pick<IShop, 'id'>): number {
    return shop.id;
  }

  compareShop(o1: Pick<IShop, 'id'> | null, o2: Pick<IShop, 'id'> | null): boolean {
    return o1 && o2 ? this.getShopIdentifier(o1) === this.getShopIdentifier(o2) : o1 === o2;
  }

  addShopToCollectionIfMissing<Type extends Pick<IShop, 'id'>>(
    shopCollection: Type[],
    ...shopsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const shops: Type[] = shopsToCheck.filter(isPresent);
    if (shops.length > 0) {
      const shopCollectionIdentifiers = shopCollection.map(shopItem => this.getShopIdentifier(shopItem)!);
      const shopsToAdd = shops.filter(shopItem => {
        const shopIdentifier = this.getShopIdentifier(shopItem);
        if (shopCollectionIdentifiers.includes(shopIdentifier)) {
          return false;
        }
        shopCollectionIdentifiers.push(shopIdentifier);
        return true;
      });
      return [...shopsToAdd, ...shopCollection];
    }
    return shopCollection;
  }

  protected convertDateFromClient<T extends IShop | NewShop | PartialUpdateShop>(shop: T): RestOf<T> {
    return {
      ...shop,
      creationDate: shop.creationDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restShop: RestShop): IShop {
    return {
      ...restShop,
      creationDate: restShop.creationDate ? dayjs(restShop.creationDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestShop>): HttpResponse<IShop> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestShop[]>): HttpResponse<IShop[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
