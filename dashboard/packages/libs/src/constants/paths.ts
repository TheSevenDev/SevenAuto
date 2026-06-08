// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
};

// ----------------------------------------------------------------------

export const paths = {
  root: '/',
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  checkout: (id: string) => `/checkout/${id}`,
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  features: '/post/features',
  termsConditions: `/post/terms-conditions`,
  privacyPolicy: `/post/privacy-policy`,
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  invite: '/invite',
  user: (username: string) => `/user/${username}`,
  userDetail: (id: string) => `/user/${id}`,
  post: {
    root: `/post`,
    details: (slug: string) => `/post/${slug}`,
  },
  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    verify: `${ROOTS.AUTH}/verify`,
    register: `${ROOTS.AUTH}/register`,
    forgotPassword: `${ROOTS.AUTH}/forgot-password`,
    resetPassword: `${ROOTS.AUTH}/reset-password`,
    confirmRegister: `${ROOTS.AUTH}/confirm-register`,
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    //
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    balance: `${ROOTS.DASHBOARD}/balance`,
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      profile: `${ROOTS.DASHBOARD}/profile`,
      account: `${ROOTS.DASHBOARD}/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      order: `${ROOTS.DASHBOARD}/user/order`,
      transaction: `${ROOTS.DASHBOARD}/user/transaction`,
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (slug: string) => `${ROOTS.DASHBOARD}/post/${slug}`,
      edit: (slug: string) => `${ROOTS.DASHBOARD}/post/${slug}/edit`,
    },
    email: {
      root: `${ROOTS.DASHBOARD}/email`,
      details: (id: string) => `${ROOTS.DASHBOARD}/email/${id}/edit`,
      send: `${ROOTS.DASHBOARD}/email/send`,
    },
    payment: {
      root: `${ROOTS.DASHBOARD}/payment`,
      new: `${ROOTS.DASHBOARD}/payment/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/payment/${id}`,
      transaction: `${ROOTS.DASHBOARD}/payment/transaction`,
    },
  },
};
