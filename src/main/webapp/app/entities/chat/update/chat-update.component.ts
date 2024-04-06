import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ChatFormService, ChatFormGroup } from './chat-form.service';
import { IChat } from '../chat.model';
import { ChatService } from '../service/chat.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccountService } from 'app/core/auth/account.service';
import { SelectedShopService } from '../service/selected-shop.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'jhi-chat-update',
  templateUrl: './chat-update.component.html',
})
export class ChatUpdateComponent implements OnInit {
  isSaving = false;
  chat: IChat | null = null;
  userLogin: string = '';
  receiverLogin: string = '';
  editForm: ChatFormGroup = this.chatFormService.createChatFormGroup();
  image: string | null = null;

  @ViewChild('editFormRef', { static: false }) editFormReference!: NgForm;

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected chatService: ChatService,
    protected chatFormService: ChatFormService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected http: HttpClient,
    protected formBuilder: FormBuilder,
    protected accountService: AccountService,
    protected selectedShopService: SelectedShopService
  ) {}

  ngOnInit(): void {
    // Retrieve current user's login
    this.accountService.identity().subscribe(account => {
      if (account) {
        const currentUserLogin = account.login;
        console.log('Current User Login:', currentUserLogin);

        // Get the user ID based on the login
        this.accountService.getUserIdByLogin(currentUserLogin).subscribe(userId => {
          if (userId !== null) {
            console.log('Current User ID:', userId);
            // Set the senderLogin to the user's ID
            this.editForm.patchValue({ senderLogin: userId.toString() });

            // Now, after setting senderLogin, you can trigger the save action
            //**************** this.save(); *******************************
            this.save();
          }
        });
      }
    });

    // Retrieve message content from query parameters
    this.activatedRoute.queryParams.subscribe(params => {
      const message = params['message'];
      const receiverLogin = params['receiverLogin'];
      const image = params['image']; // Retrieve image data from query parameters
      if (message) {
        this.editForm.patchValue({ message: message });
      }
      if (receiverLogin) {
        this.editForm.patchValue({ receiverLogin: receiverLogin });
      }
      if (image) {
        // Extract base64 data from the string
        const base64Data = image.split(';base64,')[1];
        this.editForm.patchValue({ image: base64Data });
      }
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
    const chat = this.chatFormService.getChat(this.editForm);
    if (chat.id !== null) {
      this.subscribeToSaveResponse(this.chatService.update(chat));
    } else {
      this.subscribeToSaveResponse(this.chatService.create(chat));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IChat>>): void {
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

  protected updateForm(chat: IChat): void {
    this.chat = chat;
    this.chatFormService.resetForm(this.editForm, chat);
  }
}
