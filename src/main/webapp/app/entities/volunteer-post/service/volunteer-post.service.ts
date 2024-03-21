import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import dayjs from 'dayjs/esm';

import { isPresent } from 'app/core/util/operators';
import { DATE_FORMAT } from 'app/config/input.constants';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IVolunteerPost, NewVolunteerPost } from '../volunteer-post.model';

export type PartialUpdateVolunteerPost = Partial<IVolunteerPost> & Pick<IVolunteerPost, 'id'>;

type RestOf<T extends IVolunteerPost | NewVolunteerPost> = Omit<T, 'startDate'> & {
  startDate?: string | null;
};

export type RestVolunteerPost = RestOf<IVolunteerPost>;

export type NewRestVolunteerPost = RestOf<NewVolunteerPost>;

export type PartialUpdateRestVolunteerPost = RestOf<PartialUpdateVolunteerPost>;

export type EntityResponseType = HttpResponse<IVolunteerPost>;
export type EntityArrayResponseType = HttpResponse<IVolunteerPost[]>;

@Injectable({ providedIn: 'root' })
export class VolunteerPostService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/volunteer-posts');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(volunteerPost: NewVolunteerPost): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(volunteerPost);
    return this.http
      .post<RestVolunteerPost>(this.resourceUrl, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  update(volunteerPost: IVolunteerPost): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(volunteerPost);
    return this.http
      .put<RestVolunteerPost>(`${this.resourceUrl}/${this.getVolunteerPostIdentifier(volunteerPost)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  partialUpdate(volunteerPost: PartialUpdateVolunteerPost): Observable<EntityResponseType> {
    const copy = this.convertDateFromClient(volunteerPost);
    return this.http
      .patch<RestVolunteerPost>(`${this.resourceUrl}/${this.getVolunteerPostIdentifier(volunteerPost)}`, copy, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http
      .get<RestVolunteerPost>(`${this.resourceUrl}/${id}`, { observe: 'response' })
      .pipe(map(res => this.convertResponseFromServer(res)));
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http
      .get<RestVolunteerPost[]>(this.resourceUrl, { params: options, observe: 'response' })
      .pipe(map(res => this.convertResponseArrayFromServer(res)));
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getVolunteerPostIdentifier(volunteerPost: Pick<IVolunteerPost, 'id'>): number {
    return volunteerPost.id;
  }

  compareVolunteerPost(o1: Pick<IVolunteerPost, 'id'> | null, o2: Pick<IVolunteerPost, 'id'> | null): boolean {
    return o1 && o2 ? this.getVolunteerPostIdentifier(o1) === this.getVolunteerPostIdentifier(o2) : o1 === o2;
  }

  addVolunteerPostToCollectionIfMissing<Type extends Pick<IVolunteerPost, 'id'>>(
    volunteerPostCollection: Type[],
    ...volunteerPostsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const volunteerPosts: Type[] = volunteerPostsToCheck.filter(isPresent);
    if (volunteerPosts.length > 0) {
      const volunteerPostCollectionIdentifiers = volunteerPostCollection.map(
        volunteerPostItem => this.getVolunteerPostIdentifier(volunteerPostItem)!
      );
      const volunteerPostsToAdd = volunteerPosts.filter(volunteerPostItem => {
        const volunteerPostIdentifier = this.getVolunteerPostIdentifier(volunteerPostItem);
        if (volunteerPostCollectionIdentifiers.includes(volunteerPostIdentifier)) {
          return false;
        }
        volunteerPostCollectionIdentifiers.push(volunteerPostIdentifier);
        return true;
      });
      return [...volunteerPostsToAdd, ...volunteerPostCollection];
    }
    return volunteerPostCollection;
  }

  protected convertDateFromClient<T extends IVolunteerPost | NewVolunteerPost | PartialUpdateVolunteerPost>(volunteerPost: T): RestOf<T> {
    return {
      ...volunteerPost,
      startDate: volunteerPost.startDate?.format(DATE_FORMAT) ?? null,
    };
  }

  protected convertDateFromServer(restVolunteerPost: RestVolunteerPost): IVolunteerPost {
    return {
      ...restVolunteerPost,
      startDate: restVolunteerPost.startDate ? dayjs(restVolunteerPost.startDate) : undefined,
    };
  }

  protected convertResponseFromServer(res: HttpResponse<RestVolunteerPost>): HttpResponse<IVolunteerPost> {
    return res.clone({
      body: res.body ? this.convertDateFromServer(res.body) : null,
    });
  }

  protected convertResponseArrayFromServer(res: HttpResponse<RestVolunteerPost[]>): HttpResponse<IVolunteerPost[]> {
    return res.clone({
      body: res.body ? res.body.map(item => this.convertDateFromServer(item)) : null,
    });
  }
}
