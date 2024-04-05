import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import dayjs from 'dayjs/esm';
import { DATE_TIME_FORMAT } from 'app/config/input.constants';
import { IChat, NewChat } from '../chat.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IChat for edit and NewChatFormGroupInput for create.
 */
type ChatFormGroupInput = IChat | PartialWithRequiredKeyOf<NewChat>;

/**
 * Type that converts some properties for forms.
 */
type FormValueOf<T extends IChat | NewChat> = Omit<T, 'timestamp'> & {
  timestamp?: string | null;
};

type ChatFormRawValue = FormValueOf<IChat>;

type NewChatFormRawValue = FormValueOf<NewChat>;

type ChatFormDefaults = Pick<NewChat, 'id' | 'timestamp'>;

type ChatFormGroupContent = {
  id: FormControl<ChatFormRawValue['id'] | NewChat['id']>;
  senderLogin: FormControl<ChatFormRawValue['senderLogin']>;
  receiverLogin: FormControl<ChatFormRawValue['receiverLogin']>;
  message: FormControl<ChatFormRawValue['message']>;
  image: FormControl<ChatFormRawValue['image']>;
  imageContentType: FormControl<ChatFormRawValue['imageContentType']>;
  timestamp: FormControl<ChatFormRawValue['timestamp']>;
};

export type ChatFormGroup = FormGroup<ChatFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ChatFormService {
  createChatFormGroup(chat: ChatFormGroupInput = { id: null }): ChatFormGroup {
    const chatRawValue = this.convertChatToChatRawValue({
      ...this.getFormDefaults(),
      ...chat,
    });
    return new FormGroup<ChatFormGroupContent>({
      id: new FormControl(
        { value: chatRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      senderLogin: new FormControl(chatRawValue.senderLogin, {
        validators: [Validators.required],
      }),
      receiverLogin: new FormControl(chatRawValue.receiverLogin, {
        validators: [Validators.required],
      }),
      message: new FormControl(chatRawValue.message),
      image: new FormControl(chatRawValue.image),
      imageContentType: new FormControl(chatRawValue.imageContentType),
      timestamp: new FormControl(chatRawValue.timestamp, {
        validators: [Validators.required],
      }),
    });
  }

  getChat(form: ChatFormGroup): IChat | NewChat {
    return this.convertChatRawValueToChat(form.getRawValue() as ChatFormRawValue | NewChatFormRawValue);
  }

  resetForm(form: ChatFormGroup, chat: ChatFormGroupInput): void {
    const chatRawValue = this.convertChatToChatRawValue({ ...this.getFormDefaults(), ...chat });
    form.reset(
      {
        ...chatRawValue,
        id: { value: chatRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ChatFormDefaults {
    const currentTime = dayjs();

    return {
      id: null,
      timestamp: currentTime,
    };
  }

  private convertChatRawValueToChat(rawChat: ChatFormRawValue | NewChatFormRawValue): IChat | NewChat {
    return {
      ...rawChat,
      timestamp: dayjs(rawChat.timestamp, DATE_TIME_FORMAT),
    };
  }

  private convertChatToChatRawValue(
    chat: IChat | (Partial<NewChat> & ChatFormDefaults)
  ): ChatFormRawValue | PartialWithRequiredKeyOf<NewChatFormRawValue> {
    return {
      ...chat,
      timestamp: chat.timestamp ? chat.timestamp.format(DATE_TIME_FORMAT) : undefined,
    };
  }
}
