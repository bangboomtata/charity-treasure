import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ItemComponent } from '../list/item.component';
import { ItemDetailComponent } from '../detail/item-detail.component';
import { ItemUpdateComponent } from '../update/item-update.component';
import { ItemRoutingResolveService } from './item-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';
import { SaleComponent } from '../sale/sale.component';
import { ReservationUpdateComponent } from '../../reservation/update/reservation-update.component';

const itemRoute: Routes = [
  {
    path: ':id/reservation/new',
    component: ReservationUpdateComponent,
    resolve: {
      item: ItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },

  {
    path: '',
    component: ItemComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    // ,canActivate: [UserRouteAccessService],
  },
  {
    path: 'sale',
    component: SaleComponent,
  },
  {
    path: ':id/view',
    component: ItemDetailComponent,
    resolve: {
      item: ItemRoutingResolveService,
    },
    // canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: ItemUpdateComponent,
    resolve: {
      item: ItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: ItemUpdateComponent,
    resolve: {
      item: ItemRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(itemRoute)],
  exports: [RouterModule],
})
export class ItemRoutingModule {}
