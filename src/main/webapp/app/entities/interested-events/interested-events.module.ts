import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { InterestedEventsComponent } from './list/interested-events.component';
import { InterestedEventsDetailComponent } from './detail/interested-events-detail.component';
import { InterestedEventsUpdateComponent } from './update/interested-events-update.component';
import { InterestedEventsDeleteDialogComponent } from './delete/interested-events-delete-dialog.component';
import { InterestedEventsRoutingModule } from './route/interested-events-routing.module';

import { EventRoutingModule } from '../event/route/event-routing.module';

@NgModule({
  imports: [SharedModule, InterestedEventsRoutingModule, EventRoutingModule],
  declarations: [
    InterestedEventsComponent,
    InterestedEventsDetailComponent,
    InterestedEventsUpdateComponent,
    InterestedEventsDeleteDialogComponent,
  ],
})
export class InterestedEventsModule {}
