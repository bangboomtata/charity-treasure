import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IVolunteerPost } from '../volunteer-post.model';
import { VolunteerPostService } from '../service/volunteer-post.service';

@Injectable({ providedIn: 'root' })
export class VolunteerPostRoutingResolveService implements Resolve<IVolunteerPost | null> {
  constructor(protected service: VolunteerPostService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IVolunteerPost | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((volunteerPost: HttpResponse<IVolunteerPost>) => {
          if (volunteerPost.body) {
            return of(volunteerPost.body);
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
