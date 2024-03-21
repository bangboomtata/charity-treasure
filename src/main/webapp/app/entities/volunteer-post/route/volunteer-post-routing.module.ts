import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { VolunteerPostComponent } from '../list/volunteer-post.component';
import { VolunteerPostDetailComponent } from '../detail/volunteer-post-detail.component';
import { VolunteerPostUpdateComponent } from '../update/volunteer-post-update.component';
import { VolunteerPostRoutingResolveService } from './volunteer-post-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const volunteerPostRoute: Routes = [
  {
    path: '',
    component: VolunteerPostComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: VolunteerPostDetailComponent,
    resolve: {
      volunteerPost: VolunteerPostRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: VolunteerPostUpdateComponent,
    resolve: {
      volunteerPost: VolunteerPostRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: VolunteerPostUpdateComponent,
    resolve: {
      volunteerPost: VolunteerPostRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(volunteerPostRoute)],
  exports: [RouterModule],
})
export class VolunteerPostRoutingModule {}
