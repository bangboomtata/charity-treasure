import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FormArray } from '@angular/forms';
import { finalize } from 'rxjs/operators';

import { SaleFormGroup, SaleFormService } from './sale.service';
import { SSale, subCategoryOptions } from '../item.model';
import { EventManager } from '../../../core/util/event-manager.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { ItemType } from 'app/entities/enumerations/item-type.model';
import { Gender } from 'app/entities/enumerations/gender.model';
import { ItemService } from 'app/entities/item/service/item.service';
import { AccountService } from 'app/core/auth/account.service';

@Component({
  selector: 'jhi-sale',
  styleUrls: ['./sale.component.scss'],
  templateUrl: './sale.component.html',
})
export class SaleComponent implements OnInit {
  isSaving = false;
  sale: SSale | null = null;
  genderValues = Object.values(Gender);
  itemTypeValues = Object.values(ItemType);
  shopsSharedCollection: IShop[] = [];
  shop!: IShop;

  currentSubCategories: string[] = [];
  // selectedSubcategories: {[key: string]: string[]} = {};
  editForm: SaleFormGroup = this.saleFormService.createSaleFormGroup();

  constructor(
    protected eventManager: EventManager,
    protected saleFormService: SaleFormService,
    protected shopService: ShopService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected itemService: ItemService,
    protected router: Router,
    protected accountService: AccountService
  ) {}

  shouldShowGender(itemType: string | null | undefined): boolean {
    // if more categories with gender add here
    return itemType === 'CLOTHING';
  }

  updateSubCategoryOptions(): void {
    const itemType = this.editForm.get('itemType')?.value as ItemType;
    const gender = this.editForm.get('gender')?.value;
    let subCategories: string[] = [];
    if (itemType === ItemType.CLOTHING && gender) {
      this.currentSubCategories = subCategoryOptions[itemType][gender] || [];
      subCategories = subCategoryOptions[itemType][gender] || [];
    } else if (itemType && !(itemType in subCategoryOptions)) {
      this.currentSubCategories = [];
    } else {
      this.currentSubCategories = itemType ? (subCategoryOptions[itemType] as string[]) : [];
      subCategories = subCategoryOptions[itemType] as string[];
    }
    // const key = this.generateKeyForSelection(itemType, gender);
    // const savedSelections = this.selectedSubcategories[key] || [];
    this.saleFormService.addSubCategoryCheckboxes(this.editForm, subCategories, this.sale?.subCategory || []);
  }

  ngOnInit(): void {
    this.accountService.getShop().subscribe(shop => {
      if (shop !== null) {
        this.shop = shop;
      }
    });
    this.editForm.get('itemType')!.valueChanges.subscribe(() => {
      this.updateSubCategoryOptions();
    });
    this.editForm.get('gender')!.valueChanges.subscribe(() => {
      if (this.shouldShowGender(this.editForm.get('itemType')?.value)) {
        this.updateSubCategoryOptions();
      }
    });
    // maybe get rid
    this.updateSubCategoryOptions();
  }

  previousState(): void {
    window.history.back();
  }

  getSelectedSubCategories(): String[] {
    const selectedSub: String[] = [];
    const subCategoryFormArray = this.editForm.get('subCategory') as FormArray;
    subCategoryFormArray.controls.forEach((control, index) => {
      if (control.value === true) {
        selectedSub.push(this.currentSubCategories[index]);
      }
    });
    return selectedSub;
  }

  save(): void {
    this.isSaving = true;
    const rawFormValue = this.editForm.getRawValue();
    const selectedSubCategories = rawFormValue.subCategory
      .map((isSelected, index) => (isSelected ? this.currentSubCategories[index] : null))
      .filter(subCategory => subCategory !== null);

    const submissionData = {
      ...rawFormValue,
      subCategory: selectedSubCategories,
      shop: this.shop,
    };
    console.log('the shopname is ', this.shop.shopName);
    const saleData: SSale = this.prepareDataForSubmission(submissionData);
    console.log('sale data ', saleData);
    this.subscribeToSaveResponse(this.itemService.createSale(saleData));
  }

  prepareDataForSubmission(submissionData: any): SSale {
    return submissionData as SSale;
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<boolean>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: response => {
        // Assuming the response body directly contains the boolean value
        if (response.body === true) {
          this.onSaveSuccess();
        } else {
          this.onSaveError();
        }
      },
      error: () => this.onSaveError(),
    });
  }

  protected onSaveError(): void {}

  protected onSaveSuccess(): void {
    this.router.navigate(['/item']);
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
