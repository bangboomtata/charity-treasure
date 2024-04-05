import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IInterestedEvents } from '../interested-events.model';
import { InterestedEventsService } from '../service/interested-events.service';

@Injectable({ providedIn: 'root' })
export class InterestedEventsRoutingResolveService implements Resolve<IInterestedEvents | null> {
  constructor(protected service: InterestedEventsService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IInterestedEvents | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((interestedEvents: HttpResponse<IInterestedEvents>) => {
          if (interestedEvents.body) {
            return of(interestedEvents.body);
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
