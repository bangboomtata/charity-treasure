import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ChatComponent } from './list/chat.component';
import { ChatDetailComponent } from './detail/chat-detail.component';
import { ChatUpdateComponent } from './update/chat-update.component';
import { ChatDeleteDialogComponent } from './delete/chat-delete-dialog.component';
import { ChatRoutingModule } from './route/chat-routing.module';
import { InstructionComponent } from './instruction/instruction.component';

@NgModule({
  imports: [SharedModule, ChatRoutingModule],
  declarations: [ChatComponent, ChatDetailComponent, ChatUpdateComponent, ChatDeleteDialogComponent, InstructionComponent],
})
export class ChatModule {}
