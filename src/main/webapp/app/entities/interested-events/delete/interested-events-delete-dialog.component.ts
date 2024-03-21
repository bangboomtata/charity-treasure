import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IInterestedEvents } from '../interested-events.model';
import { InterestedEventsService } from '../service/interested-events.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './interested-events-delete-dialog.component.html',
})
export class InterestedEventsDeleteDialogComponent {
  interestedEvents?: IInterestedEvents;

  constructor(protected interestedEventsService: InterestedEventsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.interestedEventsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
