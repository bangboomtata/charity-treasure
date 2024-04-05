import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICustomerEmails } from '../customer-emails.model';
import { CustomerEmailsService } from '../service/customer-emails.service';

@Injectable({ providedIn: 'root' })
export class CustomerEmailsRoutingResolveService implements Resolve<ICustomerEmails | null> {
  constructor(protected service: CustomerEmailsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICustomerEmails | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((customerEmails: HttpResponse<ICustomerEmails>) => {
          if (customerEmails.body) {
            return of(customerEmails.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
