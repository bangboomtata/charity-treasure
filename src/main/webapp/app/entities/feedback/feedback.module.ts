import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { FeedbackComponent } from './list/feedback.component';
import { FeedbackDetailComponent } from './detail/feedback-detail.component';
import { FeedbackUpdateComponent } from './update/feedback-update.component';
import { FeedbackDeleteDialogComponent } from './delete/feedback-delete-dialog.component';
import { FeedbackRoutingModule } from './route/feedback-routing.module';
import { InstructionComponent } from './instruction/instruction.component';

@NgModule({
  imports: [SharedModule, FeedbackRoutingModule],
  declarations: [FeedbackComponent, FeedbackDetailComponent, FeedbackUpdateComponent, FeedbackDeleteDialogComponent, InstructionComponent],
})
export class FeedbackModule {}
