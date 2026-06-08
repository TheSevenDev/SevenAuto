'use client';

import {
  ActionMapType,
  INotification,
  INotificationFindMany,
} from '@seven-auto/libs';
import { uniqBy } from 'lodash';
import { useAuthContext } from 'modules/auth/hooks';
import { useSnackbar } from 'modules/components/snackbar';
import { MAIN_URL } from 'modules/config-global';
import { useTranslate } from 'modules/locales';
import NotificationItem from 'modules/molecules/notification-item';
import apiServices from 'modules/services/apiService';
import { getMediaUrl } from 'modules/utils/get-media-url';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useReducer } from 'react';

import { useGlobalContext } from '../global/use-global-context';
import { NotificationContext } from './notification-context';
import { notificationConverter } from './notification-converter';
import { NotificationStateType } from './types';
// ----------------------------------------------------------------------

enum Types {
  INITIALIZED = 'INITIALIZED',
  SET_LOADING = 'SET_LOADING',
  SET_NOTIFICATIONS = 'SET_NOTIFICATIONS',
  PUSH_NOTIFICATION = 'PUSH_NOTIFICATION',
  SET_QUERY = 'SET_QUERY',
  SET_STATS = 'SET_STATS',
}

type Payload = {
  [Types.SET_LOADING]: {
    loading: boolean;
  };
  [Types.SET_NOTIFICATIONS]: {
    notifications: INotification[];
    total?: number;
  };
  [Types.INITIALIZED]: {
    notifications: INotification[];
    total: number;
    stats: {
      total: number;
      unread: number;
    };
  };
  [Types.SET_QUERY]: {
    query: INotificationFindMany;
  };
  [Types.SET_STATS]: {
    stats: {
      total?: number;
      unread?: number;
    };
  };
  [Types.PUSH_NOTIFICATION]: {
    notification: INotification;
  };
};

type ActionsType = ActionMapType<Payload>[keyof ActionMapType<Payload>];

// ----------------------------------------------------------------------

const initialState: NotificationStateType = {
  initialized: false,
  isLoading: true,
  query: {},
  total: 0,
  stats: {
    total: 0,
    unread: 0,
  },
  notifications: [],
};

const reducer = (
  state: NotificationStateType,
  action: ActionsType,
): NotificationStateType => {
  if (action.type === Types.INITIALIZED) {
    return {
      ...state,
      initialized: true,
      isLoading: false,
      notifications: action.payload.notifications,
      total: action.payload.total,
      stats: action.payload.stats,
    };
  }

  if (action.type === Types.SET_LOADING) {
    return {
      ...state,
      isLoading: action.payload.loading,
    };
  }

  if (action.type === Types.SET_NOTIFICATIONS) {
    return {
      ...state,
      notifications: action.payload.notifications,
      total: action.payload?.total || state.total,
    };
  }

  if (action.type === Types.SET_QUERY) {
    return {
      ...state,
      ...(action.payload.query.skip === 0 && {
        notifications: [],
      }),
      query: {
        ...state.query,
        ...action.payload.query,
        skip: action.payload.query.skip || 0,
        take: action.payload.query.take || 10,
      },
    };
  }

  if (action.type === Types.SET_STATS) {
    return {
      ...state,
      stats: {
        ...state.stats,
        ...action.payload.stats,
      },
    };
  }

  if (action.type === Types.PUSH_NOTIFICATION) {
    const existingNotification = state.notifications.find(
      (n) => n.id === action.payload.notification.id,
    );

    if (existingNotification) {
      return {
        ...state,
        notifications: state.notifications.map((n) =>
          n.id === action.payload.notification.id
            ? action.payload.notification
            : n,
        ),
      };
    }

    return {
      ...state,
      notifications: [action.payload.notification, ...state.notifications],
      stats: {
        ...state.stats,
        unread: state.stats.unread + 1,
      },
    };
  }

  return state;
};

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function NotificationProvider({ children }: Props) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { currentUser } = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  const { siteInfo } = useGlobalContext();
  const { t } = useTranslate();
  const router = useRouter();
  const mainUrl = MAIN_URL;

  // ----------------------------------------------------------------------

  const initialize = useCallback(async () => {
    if (!currentUser) return;
    dispatch({
      type: Types.SET_LOADING,
      payload: { loading: false },
    });

    const [data, stats] = await Promise.all([
      apiServices.notification.getNotifications(),
      apiServices.notification.getStats(),
    ]);

    dispatch({
      type: Types.INITIALIZED,
      payload: {
        notifications: data.items,
        total: data.total,
        stats,
      },
    });
  }, [currentUser]);

  const setNotificationLoading = useCallback((loading: boolean) => {
    dispatch({
      type: Types.SET_LOADING,
      payload: { loading },
    });
  }, []);

  const setQuery = useCallback((query: INotificationFindMany) => {
    dispatch({
      type: Types.SET_QUERY,
      payload: { query },
    });
  }, []);

  const markAllAsRead = useCallback(async () => {
    await apiServices.notification.readAll();
    dispatch({
      type: Types.SET_NOTIFICATIONS,
      payload: {
        notifications: state.notifications.map((n) => ({
          ...n,
          read: true,
        })),
      },
    });
    dispatch({
      type: Types.SET_STATS,
      payload: { stats: { unread: 0 } },
    });
  }, [state.notifications]);

  const markAsRead = useCallback(
    async (id: string) => {
      await apiServices.notification.readOne(id);
      dispatch({
        type: Types.SET_NOTIFICATIONS,
        payload: {
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        },
      });
      const notification = state.notifications.find((n) => n.id === id);
      if (notification?.read) return;
      dispatch({
        type: Types.SET_STATS,
        payload: { stats: { unread: state.stats.unread - 1 } },
      });
    },
    [state.notifications, state.stats.unread],
  );

  const pushNotification = useCallback(
    (notification: INotification) => {
      dispatch({
        type: Types.PUSH_NOTIFICATION,
        payload: { notification },
      });
      const isBrowserActive = !document.hidden;
      if (isBrowserActive) {
        enqueueSnackbar(
          <NotificationItem
            notification={notification}
            sx={{
              borderBottom: 'none',
            }}
          />,
          {
            variant: 'success',
            hideIconVariant: true,
            autoHideDuration: 5000,
          },
        );
      } else {
        const notificationData = notificationConverter(notification, t, router);
        const divRef = document.createElement('div');
        divRef.style.display = 'none';
        divRef.innerHTML = notificationData.title || '';
        const title = divRef.textContent || divRef.innerText || '';
        divRef.innerHTML = notificationData.content || '';
        const content = divRef.textContent || divRef.innerText || '';
        const icon =
          getMediaUrl(notificationData?.user?.avatar) || siteInfo.siteIcon;
        if ('Notification' in window) {
          const noti = new Notification(title || '', {
            body: content || '',
            icon: icon
              ? icon.startsWith('http')
                ? icon
                : `${mainUrl}${icon}`
              : '',
          });
          noti.onclick = () => {
            if (notificationData.url) {
              window.open(notificationData.url, '_blank');
            }
          };
        }
      }
    },
    [enqueueSnackbar, router, mainUrl, siteInfo?.siteIcon, t],
  );

  const loadMore = useCallback(() => {
    setQuery({
      ...state.query,
      skip: (state.query?.skip || 0) + (state.query?.take || 10),
    });
  }, [state.query, setQuery]);

  // ----------------------------------------------------------------------
  useEffect(() => {
    if (!state.initialized) {
      initialize();
    }
  }, [initialize, state.initialized, currentUser]);

  useEffect(() => {
    if (state.initialized) {
      const query = { ...state.query };
      apiServices.notification.getNotifications(query).then((data) => {
        const newNotifications = [...state.notifications, ...data.items];
        const uniqNotifications = uniqBy(newNotifications, 'id');
        dispatch({
          type: Types.SET_NOTIFICATIONS,
          payload: {
            notifications: uniqNotifications,
            total: data.total,
          },
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.initialized, state.query]);

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      ...state,
      setNotificationLoading,
      setQuery,
      markAllAsRead,
      markAsRead,
      pushNotification,
      loadMore,
    }),
    [
      state,
      setNotificationLoading,
      setQuery,
      markAllAsRead,
      markAsRead,
      pushNotification,
      loadMore,
    ],
  );

  return (
    <NotificationContext.Provider value={memoizedValue}>
      {children}
    </NotificationContext.Provider>
  );
}
