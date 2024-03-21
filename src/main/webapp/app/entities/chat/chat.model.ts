import dayjs from 'dayjs/esm';
import { GroupChatName } from 'app/entities/enumerations/group-chat-name.model';

export interface IChat {
  id: number;
  senderLogin?: string | null;
  groupChat?: GroupChatName | null;
  message?: string | null;
  image?: string | null;
  imageContentType?: string | null;
  timestamp?: dayjs.Dayjs | null;
}

export type NewChat = Omit<IChat, 'id'> & { id: null };
