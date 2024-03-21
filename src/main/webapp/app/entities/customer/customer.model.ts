import { IUser } from 'app/entities/user/user.model';
import { Status } from 'app/entities/enumerations/status.model';

export interface ICustomer {
  id: number;
  status?: Status | null;
  user?: Pick<IUser, 'id'> | null;
}

export type NewCustomer = Omit<ICustomer, 'id'> & { id: null };
