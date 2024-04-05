import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IItem, NewItem, SSale } from '../item.model';

export type PartialUpdateItem = Partial<IItem> & Pick<IItem, 'id'>;

type RestOf<T extends IItem | NewItem> = Omit<T, 'saleEndTime'> & {
  saleEndTime?: string | null;
};

export type RestItem = RestOf<IItem>;

export type NewRestItem = RestOf<NewItem>;

export type PartialUpdateRestItem = RestOf<PartialUpdateItem>;

export type EntityResponseType = HttpResponse<IItem>;
export type EntityArrayResponseType = HttpResponse<IItem[]>;

@Injectable({ providedIn: 'root' })
export class ItemService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/items');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(item: NewItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(item);
    return this.http.post<RestItem>(this.resourceUrl, copy, { observe: 'response' }).pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(item: IItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(item);
    return this.http
      .put<RestItem>(`${this.resourceUrl}/${this.getItemIdentifier(item)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  createSale(sale: SSale): Observable<HttpResponse<boolean>> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      observe: 'response' as const,
    };
    return this.http.patch<boolean>(this.applicationConfigService.getEndpointFor('api/items/sale'), sale, httpOptions);
  }

  partialUpdate(item: PartialUpdateItem): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(item);
    return this.http
      .patch<RestItem>(`${this.resourceUrl}/${this.getItemIdentifier(item)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestItem>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestItem[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getItemIdentifier(item: Pick<IItem, 'id'>): number {
    return item.id;
  }

  compareItem(o1: Pick<IItem, 'id'> | null, o2: Pick<IItem, 'id'> | null): boolean {
    return o1 && o2 ? this.getItemIdentifier(o1) === this.getItemIdentifier(o2) : o1 === o2;
  }

  addItemToCollectionIfMissing<Type extends Pick<IItem, 'id'>>(
    itemCollection: Type[],
    ...itemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const items: Type[] = itemsToCheck.filter(isPresent);
    if (items.length > 0) {
      const itemCollectionIdentifiers = itemCollection.map(itemItem => this.getItemIdentifier(itemItem)!);
      const itemsToAdd = items.filter(itemItem => {
        const itemIdentifier = this.getItemIdentifier(itemItem);
        if (itemCollectionIdentifiers.includes(itemIdentifier)) {
          return false;
        }
        itemCollectionIdentifiers.push(itemIdentifier);
        return true;
      });
      return [...itemsToAdd, ...itemCollection];
    }
    return itemCollection;
  }

  protected convertDateFromClient<T extends IItem | NewItem | PartialUpdateItem>(item: T): RestOf<T> {
    return {
      ...item,
      saleEndTime: item.saleEndTime?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restItem: RestItem): IItem {
    return {
      ...restItem,
      saleEndTime: restItem.saleEndTime ? dayjs(restItem.saleEndTime) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestItem>): HttpResponse<IItem> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestItem[]>): HttpResponse<IItem[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
