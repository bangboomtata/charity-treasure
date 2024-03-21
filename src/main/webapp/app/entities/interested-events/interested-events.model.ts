import { ICustomer } from 'app/entities/customer/customer.model';
import { IEvent } from 'app/entities/event/event.model';

export interface IInterestedEvents {
  id: number;
  user?: Pick<ICustomer, 'id'> | null;
  event?: Pick<IEvent, 'id' | 'eventName'> | null;
}

export type NewInterestedEvents = Omit<IInterestedEvents, 'id'> & { id: null };
