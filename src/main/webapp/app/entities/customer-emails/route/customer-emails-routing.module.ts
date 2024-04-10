import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CustomerEmailsComponent } from '../list/customer-emails.component';
import { CustomerEmailsDetailComponent } from '../detail/customer-emails-detail.component';
import { CustomerEmailsUpdateComponent } from '../update/customer-emails-update.component';
import { CustomerEmailsRoutingResolveService } from './customer-emails-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const customerEmailsRoute: Routes = [
  {
    path: '',
    component: CustomerEmailsComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CustomerEmailsDetailComponent,
    resolve: {
      customerEmails: CustomerEmailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CustomerEmailsUpdateComponent,
    resolve: {
      customerEmails: CustomerEmailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CustomerEmailsUpdateComponent,
    resolve: {
      customerEmails: CustomerEmailsRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(customerEmailsRoute)],
  exports: [RouterModule],
})
export class CustomerEmailsRoutingModule {}
