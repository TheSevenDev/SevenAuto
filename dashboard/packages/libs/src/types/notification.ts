import { IPayment } from './payment';
import { IPost } from './post';
import { IUser } from './user';
import { IBaseEntity, IFindMany } from './utils';

export enum ENotificationType {
  SYSTEM = 'SYSTEM',
  LIKE = 'LIKE',
  COMMENT = 'COMMENT',

  // payment
  PAYMENT_CREATED = 'PAYMENT_CREATED',
  PAYMENT_APPROVED = 'PAYMENT_APPROVED',
  PAYMENT_REJECTED = 'PAYMENT_REJECTED',
  PAYMENT_REOPENED = 'PAYMENT_REOPENED',
}

export type INotification = IBaseEntity & {
  type?: string;
  title?: string;
  content?: string;
  extras?: NotificationExtras;
  read?: boolean;
  readAt?: Date;
};

export type INotificationFindMany = IFindMany & {
  types?: ENotificationType[];
  unread?: boolean;
};

export type INotificationStats = {
  total: number;
  unread: number;
};

export type NotificationExtras =
  | INotificationLike
  | INotificationComment
  | INotificationPayment;

export type INotificationFollow = {
  userId: string;
  user?: IUser;
};

export type INotificationLike = {
  postId: string;
  userId: string;
  user?: IUser;
  post?: IPost;
};

export type INotificationComment = {
  postId: string;
  userId: string;
  user?: IUser;
  post?: IPost;
};

export type INotificationSystem = {
  payment: number;
  manage?: {
    payment: number;
  };
};

export type INotificationPayment = {
  paymentId: string;
  payment?: IPayment;
  userId: string;
  user?: IUser;
  reason?: string;
};
