import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ItemFormService, ItemFormGroup } from './item-form.service';
import { IItem } from '../item.model';
import { subCategoryOptions } from '../item.model';
import { ItemService } from '../service/item.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { Gender } from 'app/entities/enumerations/gender.model';
import { Condition } from 'app/entities/enumerations/condition.model';
import { ItemType } from 'app/entities/enumerations/item-type.model';

@Component({
  selector: 'jhi-item-update',
  styleUrls: ['./item-update.component.scss'],
  templateUrl: './item-update.component.html',
})
export class ItemUpdateComponent implements OnInit {
  isSaving = false;
  item: IItem | null = null;
  genderValues = Object.values(Gender);
  conditionValues = Object.keys(Condition);
  itemTypeValues = Object.values(ItemType);

  shopsSharedCollection: IShop[] = [];

  currentSubCategories: string[] = [];

  editForm: ItemFormGroup = this.itemFormService.createItemFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected itemService: ItemService,
    protected itemFormService: ItemFormService,
    protected shopService: ShopService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  shouldShowGender(itemType: string | null | undefined): boolean {
    return itemType === 'CLOTHING';
  }

  updateSubCategoryOptions(): void {
    const itemType = this.editForm.get('itemType')?.value as ItemType;
    const gender = this.editForm.get('gender')?.value;
    if (itemType === ItemType.CLOTHING && gender) {
      this.currentSubCategories = subCategoryOptions[itemType][gender] || [];
    } else if (itemType && !(itemType in subCategoryOptions)) {
      this.currentSubCategories = [];
    } else {
      this.currentSubCategories = itemType ? (subCategoryOptions[itemType] as string[]) : [];
    }
  }
  compareShop = (o1: IShop | null, o2: IShop | null): boolean => this.shopService.compareShop(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ item }) => {
      this.item = item;
      if (item) {
        this.updateForm(item);
        this.loadRelationshipsOptions();
      }
      this.editForm.get('itemType')!.valueChanges.subscribe(() => {
        this.updateSubCategoryOptions();
      });
      this.editForm.get('gender')!.valueChanges.subscribe(() => {
        if (this.shouldShowGender(this.editForm.get('itemType')?.value as ItemType)) {
          this.updateSubCategoryOptions();
        }
      });
      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('teamprojectApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const item = this.itemFormService.getItem(this.editForm);
    if (item.id !== null) {
      this.subscribeToSaveResponse(this.itemService.update(item));
    } else {
      this.subscribeToSaveResponse(this.itemService.create(item));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IItem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(item: IItem): void {
    this.item = item;
    this.itemFormService.resetForm(this.editForm, item);

    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing<IShop>(this.shopsSharedCollection, item.shop);
  }

  protected loadRelationshipsOptions(): void {
    this.shopService
      .query()
      .pipe(map((res: HttpResponse<IShop[]>) => res.body ?? []))
      .pipe(map((shops: IShop[]) => this.shopService.addShopToCollectionIfMissing<IShop>(shops, this.item?.shop)))
      .subscribe((shops: IShop[]) => (this.shopsSharedCollection = shops));
  }
}
