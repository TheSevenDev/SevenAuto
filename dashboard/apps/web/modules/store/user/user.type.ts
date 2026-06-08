import { IUser, IUserFindMany } from '@seven-auto/libs';

export interface UserState {
  initialized: boolean;
  initializedByUserId: string;
  isLoading: boolean;
  users: IUser[];
  total: number;
  filters: IUserFindMany;
  selected: IUser[];
}
