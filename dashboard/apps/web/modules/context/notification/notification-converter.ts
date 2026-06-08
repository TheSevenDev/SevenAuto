import {
  ENotificationType,
  INotification,
  INotificationPayment,
  IUser,
  paths,
} from '@seven-auto/libs';
import { LabelColor } from 'modules/components/label';
import { ICONS_NAME } from 'modules/const/icons';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export interface INotificationItem {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  category: string;
  user: IUser | null;
  icon: string;
  actions: {
    label: string;
    variant: 'text' | 'contained' | 'outlined';
    color?:
      | 'primary'
      | 'secondary'
      | 'inherit'
      | 'info'
      | 'success'
      | 'warning'
      | 'error';
    fn: () => void;
  }[];
  tags: {
    label: string;
    color: LabelColor;
  }[];
  url: string;
}

export const notificationConverter = (
  notification: INotification,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  t: any,
  router: AppRouterInstance,
) => {
  const result: INotificationItem = {
    id: notification.id,
    title: '',
    content: '',
    createdAt: notification.createdAt,
    category: '',
    actions: [],
    tags: [],
    user: null,
    icon: '',
    url: '',
  };

  if (!notification.type) return result;

  switch (notification.type) {
    case ENotificationType.SYSTEM:
      result.title = notification.title
        ? notification.title
        : t(`notifications.title.${notification.type}`);
      result.content = notification.content || '';
      result.category = t('notifications.category.system');
      result.tags = [];
      result.url = paths.root;
      break;
    case ENotificationType.PAYMENT_CREATED:
    case ENotificationType.PAYMENT_APPROVED:
    case ENotificationType.PAYMENT_REJECTED:
    case ENotificationType.PAYMENT_REOPENED:
      {
        const extras = notification.extras as INotificationPayment;
        result.icon = ICONS_NAME.payment;
        result.title = t(`notifications.title.${notification.type}`, {
          paymentId: `<b>${extras?.payment?.uniqueId || ''}</b>`,
        });
        result.content = '';
        if (
          notification.type === ENotificationType.PAYMENT_REJECTED ||
          notification.type === ENotificationType.PAYMENT_REOPENED
        ) {
          result.content = extras?.reason
            ? `<b>${t('basic.reason')}:</b> ${extras?.reason}`
            : '';
        }
        result.category = t('notifications.category.payment');
        result.user = null;
        result.actions = [
          {
            label: t('basic.view'),
            variant: 'contained',
            fn: () => {
              router.push(
                `${paths.checkout((extras?.payment?.id as string) || '')}`,
              );
            },
          },
        ];
        result.url = paths.checkout((extras?.payment?.id as string) || '');
      }
      break;
    default:
      break;
  }

  return result;
};
