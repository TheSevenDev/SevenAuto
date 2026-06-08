import { paths } from '@seven-auto/libs';
import apiServices from 'modules/services/apiService';
import { getCookie, removeCookie, setCookie } from 'modules/utils/cookie-utils';

export const STORAGE_KEY_ACCESS_TOKEN = 'accessToken';
export const STORAGE_KEY_REFRESH_TOKEN = 'refreshToken';

let expiredTimer: NodeJS.Timeout;
let refreshTokenExpiredTimer: NodeJS.Timeout;
// ----------------------------------------------------------------------

function jwtDecode(token: string) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url?.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window
      .atob(base64 || '')
      .split('')
      .map((c) => `%${`00${c.charCodeAt(0).toString(16)}`.slice(-2)}`)
      .join(''),
  );

  return JSON.parse(jsonPayload);
}

// ----------------------------------------------------------------------

export const isValidToken = (accessToken: string) => {
  if (!accessToken) {
    return false;
  }

  const decoded = jwtDecode(accessToken);

  const currentTime = Date.now() / 1000;

  return decoded.exp > currentTime;
};

// ----------------------------------------------------------------------

export const tokenExpired = (exp: number) => {
  const currentTime = Date.now();

  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime + 10000;

  clearTimeout(expiredTimer);

  expiredTimer = setTimeout(async () => {
    const refreshTokenStorage = getCookie(STORAGE_KEY_REFRESH_TOKEN);
    if (refreshTokenStorage) {
      try {
        const authResponse = await apiServices.auth.refreshToken({
          refreshToken: refreshTokenStorage,
        });
        const accessToken = authResponse?.accessToken;
        const refreshToken = authResponse?.refreshToken;
        setSession({ accessToken, refreshToken });
      } catch {
        removeCookie(STORAGE_KEY_REFRESH_TOKEN);
        window.location.href = paths.auth.login;
      }
    } else {
      removeCookie(STORAGE_KEY_ACCESS_TOKEN);
      window.location.href = paths.auth.login;
    }
  }, timeLeft);
};

export const refreshTokenExpired = (exp: number) => {
  const currentTime = Date.now();
  // Test token expires after 10s
  // const timeLeft = currentTime + 10000 - currentTime; // ~10s
  const timeLeft = exp * 1000 - currentTime - 10000; // 10s before token expired
  clearTimeout(refreshTokenExpiredTimer);
  // check max time to set timeout
  if (timeLeft < 0 || timeLeft > 2147483647) {
    return;
  }
  refreshTokenExpiredTimer = setTimeout(() => {
    removeCookie(STORAGE_KEY_REFRESH_TOKEN);
    window.location.href = paths.auth.login;
  }, timeLeft);
};

// ----------------------------------------------------------------------

export const setSession = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string | null;
  refreshToken: string | null;
}) => {
  if (refreshToken) {
    // Store refresh token with longer expiration (e.g., 30 days)
    setCookie(STORAGE_KEY_REFRESH_TOKEN, refreshToken, {
      expires: 30,
      secure: true,
      sameSite: 'lax',
    });
    const { exp } = jwtDecode(refreshToken);
    refreshTokenExpired(exp);
  } else {
    removeCookie(STORAGE_KEY_REFRESH_TOKEN);
  }

  if (accessToken) {
    // Store access token with shorter expiration (e.g., 7 days)
    setCookie(STORAGE_KEY_ACCESS_TOKEN, accessToken, {
      expires: 7,
      secure: true,
      sameSite: 'lax',
    });

    apiServices.setAuthorizationToken(accessToken);

    // This function below will handle when token is expired
    const { exp } = jwtDecode(accessToken);
    tokenExpired(exp);
  } else {
    removeCookie(STORAGE_KEY_ACCESS_TOKEN);
    apiServices.clearAuthorizationToken();
  }
};

export const setSessionByAdmin = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string | null;
  refreshToken: string | null;
}) => {
  // get current cookie and change key with prefix 'admin_'
  const currentAccessToken = getCookie(STORAGE_KEY_ACCESS_TOKEN);
  if (currentAccessToken) {
    setCookie(`admin_${STORAGE_KEY_ACCESS_TOKEN}`, currentAccessToken, {
      expires: 7,
      secure: true,
      sameSite: 'lax',
    });
  }
  const currentRefreshToken = getCookie(STORAGE_KEY_REFRESH_TOKEN);
  if (currentRefreshToken) {
    setCookie(`admin_${STORAGE_KEY_REFRESH_TOKEN}`, currentRefreshToken, {
      expires: 30,
      secure: true,
      sameSite: 'lax',
    });
  }

  setSession({
    accessToken,
    refreshToken,
  });
};

export const removeSessionByAdmin = () => {
  const adminAccessToken = getCookie(`admin_${STORAGE_KEY_ACCESS_TOKEN}`);
  const adminRefreshToken = getCookie(`admin_${STORAGE_KEY_REFRESH_TOKEN}`);
  if (adminAccessToken && adminRefreshToken) {
    setSession({
      accessToken: adminAccessToken,
      refreshToken: adminRefreshToken,
    });
    removeCookie(`admin_${STORAGE_KEY_ACCESS_TOKEN}`);
    removeCookie(`admin_${STORAGE_KEY_REFRESH_TOKEN}`);
  } else {
    removeCookie(`admin_${STORAGE_KEY_ACCESS_TOKEN}`);
    removeCookie(`admin_${STORAGE_KEY_REFRESH_TOKEN}`);
    removeCookie(STORAGE_KEY_ACCESS_TOKEN);
    removeCookie(STORAGE_KEY_REFRESH_TOKEN);
  }
};
