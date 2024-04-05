import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { InterestedEventsComponent } from '../list/interested-events.component';
import { InterestedEventsDetailComponent } from '../detail/interested-events-detail.component';
import { InterestedEventsUpdateComponent } from '../update/interested-events-update.component';
import { InterestedEventsRoutingResolveService } from './interested-events-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const interestedEventsRoute: Routes = [
  {
    path: '',
    component: InterestedEventsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: InterestedEventsDetailComponent,
    resolve: {
      interestedEvents: InterestedEventsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: InterestedEventsUpdateComponent,
    resolve: {
      interestedEvents: InterestedEventsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: InterestedEventsUpdateComponent,
    resolve: {
      interestedEvents: InterestedEventsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(interestedEventsRoute)],
  exports: [RouterModule],
})
export class InterestedEventsRoutingModule {}
