import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { ItemComponent } from './list/item.component';
import { ItemDetailComponent } from './detail/item-detail.component';
import { SaleComponent } from './sale/sale.component';
import { ItemUpdateComponent } from './update/item-update.component';
import { ItemDeleteDialogComponent } from './delete/item-delete-dialog.component';
import { ItemRoutingModule } from './route/item-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { NgForOf, NgIf } from '@angular/common';
import { InstructionComponent } from './instruction/instruction.component';

@NgModule({
  imports: [SharedModule, ItemRoutingModule, NgIf, NgForOf, ReactiveFormsModule],
  declarations: [ItemComponent, ItemDetailComponent, ItemUpdateComponent, SaleComponent, ItemDeleteDialogComponent, InstructionComponent],
})
export class ItemModule {}
