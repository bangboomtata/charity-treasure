import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { VolunteerPostFormService, VolunteerPostFormGroup } from './volunteer-post-form.service';
import { IVolunteerPost } from '../volunteer-post.model';
import { VolunteerPostService } from '../service/volunteer-post.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IShop } from 'app/entities/shop/shop.model';
import { ShopService } from 'app/entities/shop/service/shop.service';
import { ActiveStatus } from 'app/entities/enumerations/active-status.model';

@Component({
  selector: 'jhi-volunteer-post-update',
  templateUrl: './volunteer-post-update.component.html',
})
export class VolunteerPostUpdateComponent implements OnInit {
  isSaving = false;
  volunteerPost: IVolunteerPost | null = null;
  activeStatusValues = Object.keys(ActiveStatus);

  shopsSharedCollection: IShop[] = [];

  editForm: VolunteerPostFormGroup = this.volunteerPostFormService.createVolunteerPostFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected volunteerPostService: VolunteerPostService,
    protected volunteerPostFormService: VolunteerPostFormService,
    protected shopService: ShopService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareShop = (o1: IShop | null, o2: IShop | null): boolean => this.shopService.compareShop(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ volunteerPost }) => {
      this.volunteerPost = volunteerPost;
      if (volunteerPost) {
        this.updateForm(volunteerPost);
      }

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
    const volunteerPost = this.volunteerPostFormService.getVolunteerPost(this.editForm);
    if (volunteerPost.id !== null) {
      this.subscribeToSaveResponse(this.volunteerPostService.update(volunteerPost));
    } else {
      this.subscribeToSaveResponse(this.volunteerPostService.create(volunteerPost));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IVolunteerPost>>): void {
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

  protected updateForm(volunteerPost: IVolunteerPost): void {
    this.volunteerPost = volunteerPost;
    this.volunteerPostFormService.resetForm(this.editForm, volunteerPost);

    this.shopsSharedCollection = this.shopService.addShopToCollectionIfMissing<IShop>(this.shopsSharedCollection, volunteerPost.shop);
  }

  protected loadRelationshipsOptions(): void {
    this.shopService
      .query()
      .pipe(map((res: HttpResponse<IShop[]>) => res.body ?? []))
      .pipe(map((shops: IShop[]) => this.shopService.addShopToCollectionIfMissing<IShop>(shops, this.volunteerPost?.shop)))
      .subscribe((shops: IShop[]) => (this.shopsSharedCollection = shops));
  }
}
