import { aboutUsViLang } from './about-us';
import { authViLang } from './auth';
import { balanceViLang } from './balance';
import { basicViLang } from './basic';
import { checkoutsViLang } from './checkouts';
import { commonViLang } from './common';
import { creditsViLang } from './credits';
import { emailsViLang } from './emails';
import { footerViLang } from './footer';
import { formViLang } from './form';
import { faqsViLang } from './fqas';
import { homeViLang } from './home';
import { internalViLang } from './internal';
import { languagesViLang } from './languages';
import { navViLang } from './nav';
import { notificationsViLang } from './notifications';
import { paymentsViLang } from './payments';
import { permissionsViLang } from './permissions';
import { postsViLang } from './posts';
import { pricingViLang } from './pricing';
import { rewardsViLang } from './rewards';
import { transactionsViLang } from './transactions';
import { usersViLang } from './users';
import { validateViLang } from './validate';

export const viLang = {
  user: 'người dùng',
  profile: 'Hồ sơ',
  need_help: 'Cần giúp đỡ?',
  terms_of_service: 'Điều khoản dịch vụ',
  privacy_policy: 'Chính sách bảo mật',
  by_signing_up: 'Bằng cách đăng ký, tôi đồng ý với',
  welcome_back: 'Chào mừng trở lại',
  dashboard: 'Dashboard',
  overview: 'Tổng quan',
  management: 'Quản lý',
  blog: 'Bài viết',
  file_manager: 'Quản lý tệp',
  levels: {
    BASIC: 'Free',
    PRO: 'Pro',
    PREMIUM: 'Premium',
  },
  statusProcess: {
    PENDING: 'Chờ xử lý',
    PROCESSING: 'Đang xử lý',
    COMPLETED: 'Hoàn thành',
    CANCELED: 'Đã hủy',
  },
  status: {
    ACTIVE: 'Bật',
    INACTIVE: 'Tắt',
  },
  notFound: {
    label: 'Không tìm thấy',
    no_results_found_for: 'Không tìm thấy kết quả cho',
    try_checking_for_typos_or_using_complete_words:
      'Hãy kiểm tra lỗi chính tả hoặc sử dụng từ hoàn chỉnh.',
    enter_keywords: 'Vui lòng nhập từ khóa',
  },
  socialShare: {
    label: 'Chia sẻ',
    platform: 'Nền tảng',
    default: 'Mặc định',
    facebook: 'Facebook',
    twitter: 'X',
    linkedin: 'LinkedIn',
    pinterest: 'Pinterest',
    instagram: 'Instagram',
  },
  basic: { ...basicViLang },
  common: { ...commonViLang },
  nav: { ...navViLang },
  form: { ...formViLang },
  validate: { ...validateViLang },
  auth: { ...authViLang },
  home: { ...homeViLang },
  users: { ...usersViLang },
  footer: { ...footerViLang },
  notifications: { ...notificationsViLang },
  emails: { ...emailsViLang },
  aboutUs: { ...aboutUsViLang },
  faqs: { ...faqsViLang },
  payments: { ...paymentsViLang },
  checkouts: { ...checkoutsViLang },
  transactions: { ...transactionsViLang },
  permissions: { ...permissionsViLang },
  internal: { ...internalViLang },
  balance: { ...balanceViLang },
  posts: { ...postsViLang },
  credits: { ...creditsViLang },
  pricing: { ...pricingViLang },
  rewards: { ...rewardsViLang },
  languages: { ...languagesViLang },
};
