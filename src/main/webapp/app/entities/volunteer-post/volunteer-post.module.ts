import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { VolunteerPostComponent } from './list/volunteer-post.component';
import { VolunteerPostDetailComponent } from './detail/volunteer-post-detail.component';
import { VolunteerPostUpdateComponent } from './update/volunteer-post-update.component';
import { VolunteerPostDeleteDialogComponent } from './delete/volunteer-post-delete-dialog.component';
import { VolunteerPostRoutingModule } from './route/volunteer-post-routing.module';
import { InstructionComponent } from './instruction/instruction.component';

@NgModule({
  imports: [SharedModule, VolunteerPostRoutingModule],
  declarations: [
    VolunteerPostComponent,
    VolunteerPostDetailComponent,
    VolunteerPostUpdateComponent,
    VolunteerPostDeleteDialogComponent,
    InstructionComponent,
  ],
})
export class VolunteerPostModule {}
