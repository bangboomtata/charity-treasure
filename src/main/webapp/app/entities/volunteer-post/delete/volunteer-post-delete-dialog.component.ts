import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IVolunteerPost } from '../volunteer-post.model';
import { VolunteerPostService } from '../service/volunteer-post.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './volunteer-post-delete-dialog.component.html',
})
export class VolunteerPostDeleteDialogComponent {
  volunteerPost?: IVolunteerPost;

  constructor(protected volunteerPostService: VolunteerPostService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.volunteerPostService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
