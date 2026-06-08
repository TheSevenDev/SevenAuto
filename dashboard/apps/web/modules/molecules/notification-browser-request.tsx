'use client';

// TODO implement firebase messaging

import { useAuthContext } from 'modules/auth/hooks';
import AlertDialog from 'modules/components/custom-dialog/alert-dialog';
import { useGlobalContext } from 'modules/context/global/use-global-context';
import { useBoolean } from 'modules/hooks/use-boolean';
import { useTranslate } from 'modules/locales';
import { getCookie, setCookie } from 'modules/utils/cookie-utils';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
// import { ClientJS } from 'clientjs';

const SESSION_COOKIE_NAME = 'notification_dialog_shown';
const DELAY_TIME = 6000;

const initFCM = () => {
  // const app = initializeApp(firebaseConfig);
  // const messaging = getMessaging(app);

  // const onMessageListener = () =>
  //   new Promise((resolve) => {
  //     onMessage(messaging, (payload) => {
  //       resolve(payload);
  //     });
  //   });

  async function getFCMToken() {
    if (!('Notification' in window)) {
      return null;
    }

    let { permission } = Notification;

    if (permission === 'default') {
      try {
        permission = await Notification.requestPermission();
      } catch (e) {
        console.log('FCM failed to request permission', e);
        throw new Error('Permission request failed');
      }
    }

    if (permission !== 'granted') {
      throw new Error('Permission denied');
    }

    // if (!(await isSupported())) {
    //   console.warn('Browser does not support FCM');
    // }
    // return getToken(messaging, { vapidKey: firebasePublicKey });
    return null;
  }

  return {
    getFCMToken,
    // onMessageListener,
  };
};

function NotificationBrowserRequest() {
  const { t } = useTranslate();
  const { currentUser } = useAuthContext();
  const { siteInfo } = useGlobalContext();
  const fcmRequest = useBoolean(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showNotice, setShowNotice] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);
  const hasCheckedRef = useRef(false);
  const { getFCMToken } = useMemo(() => initFCM(), []);

  // Check if dialog already shown in this session
  const isDialogShown = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return getCookie(SESSION_COOKIE_NAME) === 'true';
  }, []);

  const markDialogAsShown = useCallback(() => {
    setCookie(SESSION_COOKIE_NAME, 'true');
  }, []);

  const handleFCMToken = useCallback(async () => {
    if (!('Notification' in window)) {
      return;
    }
    if (Notification.permission === 'denied') {
      setShowWarning(true);
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const token = await getFCMToken();
      // const client = new ClientJS();
      // const device = {
      //   browser: client.getBrowser(),
      //   os: client.getOS(),
      //   deviceName: client.getDevice(),
      //   type: client.getDeviceType(),
      // };
      // await registerToken({
      //   token,
      //   fingerprint: client.getFingerprint(),
      //   device,
      // });
    } catch (e) {
      console.warn('Failed to get FCM token', e);
    }
  }, [getFCMToken]);

  const handleDismiss = useCallback(() => {
    fcmRequest.onFalse();
    markDialogAsShown();
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }, [fcmRequest, markDialogAsShown]);

  const handleConfirm = useCallback(async () => {
    fcmRequest.onFalse();
    markDialogAsShown();
    await handleFCMToken();
  }, [fcmRequest, markDialogAsShown, handleFCMToken]);

  const handleWarningDismiss = useCallback(() => {
    setShowWarning(false);
    if (timer.current) {
      clearTimeout(timer.current);
    }
  }, []);

  const noticeContent = useMemo(() => {
    if (showNotice) {
      return t('notifications.alert.notice', {
        appName: siteInfo?.siteName || '',
      });
    }
    return t('notifications.alert.request', {
      appName: siteInfo?.siteName || '',
    });
  }, [showNotice, t, siteInfo?.siteName]);

  const warningContent = useMemo(
    () =>
      t('notifications.alert.warningContent', {
        appName: siteInfo?.siteName || '',
      }),
    [t, siteInfo?.siteName],
  );

  useEffect(() => {
    // Prevent multiple checks or if already shown in session
    if (hasCheckedRef.current || isDialogShown) {
      return undefined;
    }

    const checkNotificationPermission = async () => {
      if (!('Notification' in window) || !currentUser) {
        return;
      }

      hasCheckedRef.current = true;
      const { permission } = Notification;

      if (permission === 'default') {
        setShowNotice(false);
        fcmRequest.onTrue();
      } else if (permission === 'granted') {
        handleFCMToken();
        markDialogAsShown();
      } else if (permission === 'denied') {
        setShowNotice(true);
        fcmRequest.onTrue();
        // Don't mark as shown here - let user interact first
      }
    };

    timer.current = setTimeout(checkNotificationPermission, DELAY_TIME);

    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
      }
    };
  }, [
    currentUser,
    isDialogShown,
    fcmRequest,
    handleFCMToken,
    markDialogAsShown,
  ]);

  // Early return if already shown in session (except for warning)
  if (isDialogShown && !showWarning && !fcmRequest.value) {
    return null;
  }

  return (
    <>
      <AlertDialog
        title={t('notifications.alert.title')}
        content={noticeContent}
        open={fcmRequest.value}
        onDismiss={handleDismiss}
        cancelBtn={t('basic.cancel')}
        confirmBtn={t('basic.confirm')}
        onConfirm={handleConfirm}
      />
      {showWarning && (
        <AlertDialog
          title={t('notifications.alert.warning')}
          content={warningContent}
          open
          cancelBtn={t('basic.cancel')}
          confirmBtn={t('basic.confirm')}
          onDismiss={handleWarningDismiss}
        />
      )}
    </>
  );
}

export default NotificationBrowserRequest;
