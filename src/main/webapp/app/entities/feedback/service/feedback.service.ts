import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IFeedback, NewFeedback } from '../feedback.model';

import { FormGroup, FormControl, Validators } from '@angular/forms';

export type PartialUpdateFeedback = Partial<IFeedback> & Pick<IFeedback, 'id'>;

type RestOf<T extends IFeedback | NewFeedback> = Omit<T, 'time'> & {
  time?: string | null;
};

export type RestFeedback = RestOf<IFeedback>;

export type NewRestFeedback = RestOf<NewFeedback>;

export type PartialUpdateRestFeedback = RestOf<PartialUpdateFeedback>;

export type EntityResponseType = HttpResponse<IFeedback>;
export type EntityArrayResponseType = HttpResponse<IFeedback[]>;

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/feedbacks');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(feedback: NewFeedback): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feedback);
    return this.http
      .post<RestFeedback>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(feedback: IFeedback): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feedback);
    return this.http
      .put<RestFeedback>(`${this.resourceUrl}/${this.getFeedbackIdentifier(feedback)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(feedback: PartialUpdateFeedback): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(feedback);
    return this.http
      .patch<RestFeedback>(`${this.resourceUrl}/${this.getFeedbackIdentifier(feedback)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestFeedback>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestFeedback[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getFeedbackIdentifier(feedback: Pick<IFeedback, 'id'>): number {
    return feedback.id;
  }

  compareFeedback(o1: Pick<IFeedback, 'id'> | null, o2: Pick<IFeedback, 'id'> | null): boolean {
    return o1 && o2 ? this.getFeedbackIdentifier(o1) === this.getFeedbackIdentifier(o2) : o1 === o2;
  }

  addFeedbackToCollectionIfMissing<Type extends Pick<IFeedback, 'id'>>(
    feedbackCollection: Type[],
    ...feedbacksToCheck: (Type | null | undefined)[]
  ): Type[] {
    const feedbacks: Type[] = feedbacksToCheck.filter(isPresent);
    if (feedbacks.length > 0) {
      const feedbackCollectionIdentifiers = feedbackCollection.map(feedbackItem => this.getFeedbackIdentifier(feedbackItem)!);
      const feedbacksToAdd = feedbacks.filter(feedbackItem => {
        const feedbackIdentifier = this.getFeedbackIdentifier(feedbackItem);
        if (feedbackCollectionIdentifiers.includes(feedbackIdentifier)) {
          return false;
        }
        feedbackCollectionIdentifiers.push(feedbackIdentifier);
        return true;
      });
      return [...feedbacksToAdd, ...feedbackCollection];
    }
    return feedbackCollection;
  }

  protected convertDateFromClient<T extends IFeedback | NewFeedback | PartialUpdateFeedback>(feedback: T): RestOf<T> {
    return {
      ...feedback,
      time: feedback.time?.toJSON() ?? null,
    };
  }

  protected convertDateFromServer(restFeedback: RestFeedback): IFeedback {
    return {
      ...restFeedback,
      time: restFeedback.time ? dayjs(restFeedback.time) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestFeedback>): HttpResponse<IFeedback> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestFeedback[]>): HttpResponse<IFeedback[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }

  calculateAverageRating(): Observable<number> {
    return this.http.get<IFeedback[]>('/api/feedback').pipe(
      map(feedbacks => {
        const validFeedbacks = feedbacks.filter(feedback => feedback.rating != null);
        const totalRating = validFeedbacks.reduce((acc, feedback) => acc + feedback.rating!, 0);
        return validFeedbacks.length > 0 ? totalRating / validFeedbacks.length : 0;
      })
    );
  }
}
