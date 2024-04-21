import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICustomerEmails, NewCustomerEmails } from '../customer-emails.model';

export type PartialUpdateCustomerEmails = Partial<ICustomerEmails> & Pick<ICustomerEmails, 'id'>;

export type EntityResponseType = HttpResponse<ICustomerEmails>;
export type EntityArrayResponseType = HttpResponse<ICustomerEmails[]>;

@Injectable({ providedIn: 'root' })
export class CustomerEmailsService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/customer-emails');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(customerEmails: NewCustomerEmails): Observable<EntityResponseType> {
    return this.http.post<ICustomerEmails>(this.resourceUrl, customerEmails, { observe: 'response' });
  }

  update(customerEmails: ICustomerEmails): Observable<EntityResponseType> {
    return this.http.put<ICustomerEmails>(`${this.resourceUrl}/${this.getCustomerEmailsIdentifier(customerEmails)}`, customerEmails, {
      observe: 'response',
    });
  }

  partialUpdate(customerEmails: PartialUpdateCustomerEmails): Observable<EntityResponseType> {
    return this.http.patch<ICustomerEmails>(`${this.resourceUrl}/${this.getCustomerEmailsIdentifier(customerEmails)}`, customerEmails, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICustomerEmails>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICustomerEmails[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  ifEmailExists(email: string): Observable<ICustomerEmails[]> {
    return this.http.get<ICustomerEmails[]>(`${this.resourceUrl}/email/${email}`).pipe(
      catchError(error => {
        return throwError(() => new Error('Error fetching customers by email'));
      })
    );
  }

  getIdByEmail(email: string): Observable<number[]> {
    return this.http.get<number[]>(`${this.resourceUrl}/email/delete/${email}`).pipe(
      catchError(error => {
        return throwError(() => new Error('Error fetching customer IDs by email'));
      })
    );
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCustomerEmailsIdentifier(customerEmails: Pick<ICustomerEmails, 'id'>): number {
    return customerEmails.id;
  }

  compareCustomerEmails(o1: Pick<ICustomerEmails, 'id'> | null, o2: Pick<ICustomerEmails, 'id'> | null): boolean {
    return o1 && o2 ? this.getCustomerEmailsIdentifier(o1) === this.getCustomerEmailsIdentifier(o2) : o1 === o2;
  }

  addCustomerEmailsToCollectionIfMissing<Type extends Pick<ICustomerEmails, 'id'>>(
    customerEmailsCollection: Type[],
    ...customerEmailsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const customerEmails: Type[] = customerEmailsToCheck.filter(isPresent);
    if (customerEmails.length > 0) {
      const customerEmailsCollectionIdentifiers = customerEmailsCollection.map(
        customerEmailsItem => this.getCustomerEmailsIdentifier(customerEmailsItem)!
      );
      const customerEmailsToAdd = customerEmails.filter(customerEmailsItem => {
        const customerEmailsIdentifier = this.getCustomerEmailsIdentifier(customerEmailsItem);
        if (customerEmailsCollectionIdentifiers.includes(customerEmailsIdentifier)) {
          return false;
        }
        customerEmailsCollectionIdentifiers.push(customerEmailsIdentifier);
        return true;
      });
      return [...customerEmailsToAdd, ...customerEmailsCollection];
    }
    return customerEmailsCollection;
  }
}
