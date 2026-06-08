import { aboutUsEnLang } from './about-us';
import { authEnLang } from './auth';
import { balanceEnLang } from './balance';
import { basicEnLang } from './basic';
import { checkoutsEnLang } from './checkouts';
import { commonEnLang } from './common';
import { creditsEnLang } from './credits';
import { emailsEnLang } from './emails';
import { footerEnLang } from './footer';
import { formEnLang } from './form';
import { faqsEnLang } from './fqas';
import { homeEnLang } from './home';
import { internalEnLang } from './internal';
import { languagesEnLang } from './languages';
import { navEnLang } from './nav';
import { notificationsEnLang } from './notifications';
import { paymentsEnLang } from './payments';
import { permissionsEnLang } from './permissions';
import { postsEnLang } from './posts';
import { pricingEnLang } from './pricing';
import { rewardsEnLang } from './rewards';
import { transactionsEnLang } from './transactions';
import { usersEnLang } from './users';
import { validateEnLang } from './validate';

export const enLang = {
  user: 'user',
  profile: 'Profile',
  need_help: 'Need help?',
  terms_of_service: 'Terms of Service',
  privacy_policy: 'Privacy Policy',
  by_signing_up: 'By signing up, I agree to',
  welcome_back: 'Hi, Welcome back',
  dashboard: 'Dashboard',
  overview: 'Overview',
  management: 'Management',
  blog: 'Blog',
  file_manager: 'File Manager',
  levels: {
    BASIC: 'Free',
    PRO: 'Pro',
    PREMIUM: 'Premium',
  },
  statusProcess: {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    COMPLETED: 'Completed',
    CANCELED: 'Canceled',
  },
  status: {
    ACTIVE: 'Active',
    INACTIVE: 'Inactive',
  },
  notFound: {
    label: 'Not Found',
    no_results_found_for: 'No results found for',
    try_checking_for_typos_or_using_complete_words:
      'Try checking for typos or using complete words',
    enter_keywords: 'Please enter keywords',
  },
  socialShare: {
    label: 'Social Share',
    platform: 'Platform',
    default: 'Default',
    facebook: 'Facebook',
    twitter: 'X',
    linkedin: 'LinkedIn',
    pinterest: 'Pinterest',
    instagram: 'Instagram',
  },
  basic: { ...basicEnLang },
  common: { ...commonEnLang },
  nav: { ...navEnLang },
  form: { ...formEnLang },
  validate: { ...validateEnLang },
  auth: { ...authEnLang },
  home: { ...homeEnLang },
  users: { ...usersEnLang },
  footer: { ...footerEnLang },
  notifications: { ...notificationsEnLang },
  emails: { ...emailsEnLang },
  aboutUs: { ...aboutUsEnLang },
  faqs: { ...faqsEnLang },
  payments: { ...paymentsEnLang },
  checkouts: { ...checkoutsEnLang },
  transactions: { ...transactionsEnLang },
  permissions: { ...permissionsEnLang },
  internal: { ...internalEnLang },
  balance: { ...balanceEnLang },
  posts: { ...postsEnLang },
  credits: { ...creditsEnLang },
  pricing: { ...pricingEnLang },
  rewards: { ...rewardsEnLang },
  languages: { ...languagesEnLang },
};
