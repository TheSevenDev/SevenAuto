import 'modules/global.css';

import { ELanguage } from '@seven-auto/libs';
import { AuthProvider } from 'modules/auth/context';
import { GlobalComponent } from 'modules/common/global-component';
import Meta from 'modules/common/meta';
import { MotionLazy } from 'modules/components/animate/motion-lazy';
import ProgressBar from 'modules/components/progress-bar';
import { SettingsDrawer, SettingsProvider } from 'modules/components/settings';
import SnackbarProvider from 'modules/components/snackbar/snackbar-provider';
import { MAIN_URL } from 'modules/config-global';
import { GlobalProvider } from 'modules/context/global/global-provider';
import { NotificationProvider } from 'modules/context/notification/notification-provider';
import ReactQueryClientProvider from 'modules/context/ReactQueryClientProvider';
import { WebsocketProvider } from 'modules/context/websocket/websocket-provider';
import { LocalizationProvider } from 'modules/locales';
import AuthDialog from 'modules/sections/auth/auth-dialog';
import { FileManagerDialog } from 'modules/sections/file-manager/view';
import apiServices from 'modules/services/apiService';
// ----------------------------------------------------------------------
import ThemeProvider from 'modules/theme';
import { primaryFont } from 'modules/theme/typography';
import type { Viewport } from 'next';
import { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export default async function RootLayout({ children }: Props) {
  const locale = (await getLocale()) as ELanguage;
  const siteInfo = await apiServices.general.getSiteInfo(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={primaryFont.className}
      suppressHydrationWarning
    >
      <Meta siteInfo={siteInfo} />
      <body suppressHydrationWarning>
        <NextIntlClientProvider messages={messages}>
          <ReactQueryClientProvider>
            <GlobalProvider siteInfo={siteInfo}>
              <AuthProvider>
                <LocalizationProvider>
                  <SettingsProvider
                    defaultSettings={{
                      themeMode: 'dark', // 'light' | 'dark'
                      themeDirection: 'ltr', //  'rtl' | 'ltr'
                      themeContrast: 'default', // 'default' | 'bold'
                      themeLayout: 'vertical', // 'vertical' | 'horizontal' | 'mini'
                      themeColorPresets: 'default', // 'default' | 'cyan' | 'purple' | 'blue' | 'orange' | 'red'
                      themeStretch: true,
                    }}
                  >
                    <ThemeProvider>
                      <MotionLazy>
                        <SnackbarProvider>
                          <SettingsDrawer />
                          <ProgressBar />
                          <NotificationProvider>
                            <WebsocketProvider>
                              {children}
                              <GlobalComponent />
                            </WebsocketProvider>
                          </NotificationProvider>
                        </SnackbarProvider>
                      </MotionLazy>
                      <FileManagerDialog />
                      <AuthDialog />
                    </ThemeProvider>
                  </SettingsProvider>
                </LocalizationProvider>
              </AuthProvider>
            </GlobalProvider>
          </ReactQueryClientProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const siteInfo = await apiServices.general.getSiteInfo();
  const baseURL = MAIN_URL ?? 'http://localhost:7272';
  const metadata: Metadata = {
    manifest: '/manifest.json',
    metadataBase: new URL(baseURL),
  };
  if (siteInfo?.siteTitle) metadata.title = siteInfo?.siteTitle;
  if (siteInfo?.siteDescription)
    metadata.description = siteInfo?.siteDescription;
  if (siteInfo?.siteKeywords) metadata.keywords = siteInfo?.siteKeywords;
  if (siteInfo?.siteIcon)
    metadata.icons = [{ rel: 'icon', url: siteInfo?.siteIcon }];

  if (siteInfo?.siteImage) {
    metadata.openGraph = {
      type: 'website',
      url: baseURL,
      title: siteInfo?.siteTitle,
      description: siteInfo?.siteDescription,
      siteName: siteInfo?.siteTitle,
      images: [{ url: siteInfo?.siteImage }],
    };
    metadata.twitter = { images: [{ url: siteInfo?.siteImage }] };
  }

  if (siteInfo?.siteAuthor)
    metadata.authors = [
      {
        name: siteInfo?.siteAuthor,
        // TODO
        url: baseURL,
      },
    ];

  metadata.other = {};
  if (siteInfo?.facebookAppId)
    metadata.other = {
      'fb:app_id': siteInfo?.facebookAppId,
    };
  if (siteInfo?.siteCopyright)
    metadata.other.copyright = siteInfo?.siteCopyright;
  if (siteInfo?.siteLanguage)
    metadata.other.language = locale || siteInfo?.siteLanguage;

  return metadata;
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#000000',
  // Also supported by less commonly used
  // interactiveWidget: 'resizes-visual',
};
