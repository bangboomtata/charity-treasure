import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IShop } from '../shop.model';
import { ShopService } from '../service/shop.service';

@Injectable({ providedIn: 'root' })
export class ShopRoutingResolveService implements Resolve<IShop | null> {
  constructor(protected service: ShopService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IShop | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((shop: HttpResponse<IShop>) => {
          if (shop.body) {
            return of(shop.body);
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
