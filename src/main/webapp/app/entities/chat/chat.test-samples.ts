import dayjs from 'dayjs/esm';

import { GroupChatName } from 'app/entities/enumerations/group-chat-name.model';

import { IChat, NewChat } from './chat.model';

export const sampleWithRequiredData: IChat = {
  id: 24892,
  senderLogin: 'Grocery',
  timestamp: dayjs('2024-03-21T12:53'),
};

export const sampleWithPartialData: IChat = {
  id: 99920,
  senderLogin: 'Steel program Corporate',
  groupChat: GroupChatName['CANCERRESEARCHCENTER'],
  message: 'visionary tan Web',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  timestamp: dayjs('2024-03-20T22:09'),
};

export const sampleWithFullData: IChat = {
  id: 99550,
  senderLogin: 'Awesome orchid Concrete',
  groupChat: GroupChatName['CANCERRESEARCHCENTER'],
  message: 'enhance Junctions',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  timestamp: dayjs('2024-03-21T07:41'),
};

export const sampleWithNewData: NewChat = {
  senderLogin: 'up',
  timestamp: dayjs('2024-03-21T11:09'),
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
