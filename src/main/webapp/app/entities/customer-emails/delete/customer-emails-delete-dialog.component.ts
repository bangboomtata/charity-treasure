import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICustomerEmails } from '../customer-emails.model';
import { CustomerEmailsService } from '../service/customer-emails.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './customer-emails-delete-dialog.component.html',
})
export class CustomerEmailsDeleteDialogComponent {
  customerEmails?: ICustomerEmails;

  constructor(protected customerEmailsService: CustomerEmailsService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.customerEmailsService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
