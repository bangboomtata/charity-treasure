import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CustomerEmailsComponent } from './list/customer-emails.component';
import { CustomerEmailsDetailComponent } from './detail/customer-emails-detail.component';
import { CustomerEmailsUpdateComponent } from './update/customer-emails-update.component';
import { CustomerEmailsDeleteDialogComponent } from './delete/customer-emails-delete-dialog.component';
import { CustomerEmailsRoutingModule } from './route/customer-emails-routing.module';

@NgModule({
  imports: [SharedModule, CustomerEmailsRoutingModule],
  declarations: [
    CustomerEmailsComponent,
    CustomerEmailsDetailComponent,
    CustomerEmailsUpdateComponent,
    CustomerEmailsDeleteDialogComponent,
  ],
})
export class CustomerEmailsModule {}
