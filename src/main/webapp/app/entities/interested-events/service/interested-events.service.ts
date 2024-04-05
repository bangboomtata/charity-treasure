import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IInterestedEvents, NewInterestedEvents } from '../interested-events.model';

export type PartialUpdateInterestedEvents = Partial<IInterestedEvents> & Pick<IInterestedEvents, 'id'>;

export type EntityResponseType = HttpResponse<IInterestedEvents>;
export type EntityArrayResponseType = HttpResponse<IInterestedEvents[]>;

@Injectable({ providedIn: 'root' })
export class InterestedEventsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/interested-events');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(interestedEvents: NewInterestedEvents): Observable<EntityResponseType> {
    return this.http.post<IInterestedEvents>(this.resourceUrl, interestedEvents, { observe: 'response' });
  }

  update(interestedEvents: IInterestedEvents): Observable<EntityResponseType> {
    return this.http.put<IInterestedEvents>(
      `${this.resourceUrl}/${this.getInterestedEventsIdentifier(interestedEvents)}`,
      interestedEvents,
      { observe: 'response' }
    );
  }

  partialUpdate(interestedEvents: PartialUpdateInterestedEvents): Observable<EntityResponseType> {
    return this.http.patch<IInterestedEvents>(
      `${this.resourceUrl}/${this.getInterestedEventsIdentifier(interestedEvents)}`,
      interestedEvents,
      { observe: 'response' }
    );
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IInterestedEvents>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IInterestedEvents[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getInterestedEventsIdentifier(interestedEvents: Pick<IInterestedEvents, 'id'>): number {
    return interestedEvents.id;
  }

  compareInterestedEvents(o1: Pick<IInterestedEvents, 'id'> | null, o2: Pick<IInterestedEvents, 'id'> | null): boolean {
    return o1 && o2 ? this.getInterestedEventsIdentifier(o1) === this.getInterestedEventsIdentifier(o2) : o1 === o2;
  }

  addInterestedEventsToCollectionIfMissing<Type extends Pick<IInterestedEvents, 'id'>>(
    interestedEventsCollection: Type[],
    ...interestedEventsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const interestedEvents: Type[] = interestedEventsToCheck.filter(isPresent);
    if (interestedEvents.length > 0) {
      const interestedEventsCollectionIdentifiers = interestedEventsCollection.map(
        interestedEventsItem => this.getInterestedEventsIdentifier(interestedEventsItem)!
      );
      const interestedEventsToAdd = interestedEvents.filter(interestedEventsItem => {
        const interestedEventsIdentifier = this.getInterestedEventsIdentifier(interestedEventsItem);
        if (interestedEventsCollectionIdentifiers.includes(interestedEventsIdentifier)) {
          return false;
        }
        interestedEventsCollectionIdentifiers.push(interestedEventsIdentifier);
        return true;
      });
      return [...interestedEventsToAdd, ...interestedEventsCollection];
    }
    return interestedEventsCollection;
  }
}
