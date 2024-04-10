import { Component, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'jhi-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.scss'],
})
export class PermissionComponent {
  @Output() permissionGranted: EventEmitter<void> = new EventEmitter<void>();

  constructor(protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  grantPermission(): void {
    this.permissionGranted.emit(); // Emit event when permission is granted
    this.activeModal.close(); // Close the modal
  }
}
