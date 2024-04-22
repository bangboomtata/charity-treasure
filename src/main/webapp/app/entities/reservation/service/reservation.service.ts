import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReservation, NewReservation } from '../reservation.model';
import { ItemService } from '../../item/service/item.service';
import { IItem } from '../../item/item.model';

export type PartialUpdateReservation = Partial<IReservation> & Pick<IReservation, 'id'>;

type RestOf<T extends IReservation | NewReservation> = Omit<T, 'reservedTime' | 'reservedExpiry'> & {
  reservedTime?: string | null;
  reservedExpiry?: string | null;
};

export type RestReservation = RestOf<IReservation>;

export type NewRestReservation = RestOf<NewReservation>;

export type PartialUpdateRestReservation = RestOf<PartialUpdateReservation>;

export type EntityResponseType = HttpResponse<IReservation>;
export type EntityArrayResponseType = HttpResponse<IReservation[]>;

@Injectable({ providedIn: 'root' })
export class ReservationService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/reservations');
  itemAvailability: boolean | null | undefined = undefined;
  itemId: number | null = null;
  item: IItem | null | undefined = null;

  constructor(
    protected http: HttpClient,
    protected applicationConfigService: ApplicationConfigService,
    protected itemService: ItemService
  ) {}

  create(reservation: NewReservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reservation);
    return this.http
      .post<RestReservation>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(reservation: IReservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reservation);
    return this.http
      .put<RestReservation>(`${this.resourceUrl}/${this.getReservationIdentifier(reservation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(reservation: PartialUpdateReservation): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(reservation);
    return this.http
      .patch<RestReservation>(`${this.resourceUrl}/${this.getReservationIdentifier(reservation)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestReservation>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestReservation[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  // Assuming this is inside your ReservationService where `itemService` is already injected.

  delete(id: number): Observable<HttpResponse<{}>> {
    return new Observable(subscriber => {
      // Assuming this.find() properly retrieves the full Reservation including the item object
      this.find(id).subscribe({
        next: reservationResponse => {
          const reservation = reservationResponse.body;
          if (reservation && reservation.item && reservation.item.id) {
            // Fetch the full item details if necessary
            this.itemService.find(reservation.item.id).subscribe({
              next: itemResponse => {
                const item = itemResponse.body;
                if (item) {
                  // Update the item's availability
                  item.itemAvailability = true;

                  // Update the item
                  this.itemService.update(item).subscribe({
                    next: () => {
                      console.log('Item updated successfully');
                      // Proceed to delete the reservation
                      this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' }).subscribe({
                        next: response => {
                          subscriber.next(response);
                          subscriber.complete();
                        },
                        error: err => {
                          console.error('Error deleting reservation', err);
                          subscriber.error(err);
                        },
                      });
                    },
                    error: err => {
                      console.error('Error updating item', err);
                      subscriber.error(err);
                    },
                  });
                } else {
                  subscriber.error(new Error('Item not found for updating availability'));
                }
              },
              error: err => {
                console.error('Error fetching item', err);
                subscriber.error(err);
              },
            });
          } else {
            console.error('Reservation not found or item missing');
            subscriber.error(new Error('Reservation not found or item missing'));
          }
        },
        error: err => {
          console.error('Error fetching reservation', err);
          subscriber.error(err);
        },
      });
    });
  }

  getReservationIdentifier(reservation: Pick<IReservation, 'id'>): number {
    return reservation.id;
  }

  compareReservation(o1: Pick<IReservation, 'id'> | null, o2: Pick<IReservation, 'id'> | null): boolean {
    return o1 && o2 ? this.getReservationIdentifier(o1) === this.getReservationIdentifier(o2) : o1 === o2;
  }

  addReservationToCollectionIfMissing<Type extends Pick<IReservation, 'id'>>(
    reservationCollection: Type[],
    ...reservationsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const reservations: Type[] = reservationsToCheck.filter(isPresent);
    if (reservations.length > 0) {
      const reservationCollectionIdentifiers = reservationCollection.map(
        reservationItem => this.getReservationIdentifier(reservationItem)!
      );
      const reservationsToAdd = reservations.filter(reservationItem => {
        const reservationIdentifier = this.getReservationIdentifier(reservationItem);
        if (reservationCollectionIdentifiers.includes(reservationIdentifier)) {
          return false;
        }
        reservationCollectionIdentifiers.push(reservationIdentifier);
        return true;
      });
      return [...reservationsToAdd, ...reservationCollection];
    }
    return reservationCollection;
  }

  protected convertDateFromClient<T extends IReservation | NewReservation | PartialUpdateReservation>(reservation: T): RestOf<T> {
    return {
      ...reservation,
      reservedTime: reservation.reservedTime?.toJSON() ?? null,
      reservedExpiry: reservation.reservedExpiry?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restReservation: RestReservation): IReservation {
    return {
      ...restReservation,
      reservedTime: restReservation.reservedTime ? dayjs(restReservation.reservedTime) : undefined,
      reservedExpiry: restReservation.reservedExpiry ? dayjs(restReservation.reservedExpiry) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestReservation>): HttpResponse<IReservation> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestReservation[]>): HttpResponse<IReservation[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
