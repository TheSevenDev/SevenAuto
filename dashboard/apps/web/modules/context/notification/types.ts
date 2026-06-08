import {
  INotification,
  INotificationFindMany,
  INotificationStats,
} from '@seven-auto/libs';

// ----------------------------------------------------------------------

export type NotificationStateType = {
  initialized: boolean;
  isLoading: boolean;
  total: number;
  stats: INotificationStats;
  query: INotificationFindMany;
  notifications: INotification[];
};

// ----------------------------------------------------------------------

export type NotificationContextType = {
  initialized: boolean;
  isLoading: boolean;
  total: number;
  stats: INotificationStats;
  query: INotificationFindMany;
  notifications: INotification[];
  setNotificationLoading: (loading: boolean) => void;
  setQuery: (query: INotificationFindMany) => void;
  markAllAsRead: () => void;
  markAsRead: (id: string) => void;
  pushNotification: (notification: INotification) => void;
  loadMore: () => void;
};
