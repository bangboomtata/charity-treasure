import dayjs from 'dayjs/esm';

export interface IChat {
  id: number;
  senderLogin?: string | null;
  receiverLogin?: string | null;
  message?: string | null;
  image?: string | null;
  imageContentType?: string | null;
  timestamp?: dayjs.Dayjs | null;
}

export type NewChat = Omit<IChat, 'id'> & { id: null };
