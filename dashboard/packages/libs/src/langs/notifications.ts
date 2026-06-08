const notificationsEnLang = {
  label: 'Notifications',
  markAllAsRead: 'Mark all as read',
  note: 'Number of notifications in the last 30 days',
  category: {
    system: 'System',
    payment: 'Payment',
  },
  alert: {
    notice:
      'You are seeing this because you have not yet enabled notifications from {appName}?',
    request: 'Do you want to receive notifications from {appName}?',
    title: 'Get informed',
    warning: 'Notifications blocked',
    warningContent:
      'You have blocked notifications from {appName}. You can enable them in your browser settings.',
  },
  on: 'On notifications',
  requestPermission: 'Request permission to receive notifications',
  title: {
    SYSTEM: 'System notification',
    LIKE: 'New like',
    COMMENT: 'New comment',
    PAYMENT_CREATED: 'Payment {paymentId} created',
    PAYMENT_APPROVED: 'Payment {paymentId} approved',
    PAYMENT_REJECTED: 'Payment {paymentId} rejected',
    PAYMENT_REOPENED: 'Payment {paymentId} reopened',
  },
};

const notificationsViLang = {
  label: 'Thông báo',
  markAllAsRead: 'Đánh dấu tất cả đã đọc',
  note: 'Số lượng thông báo trong vòng 30 ngày gần nhất',
  category: {
    system: 'Hệ thống',
    payment: 'Thanh toán',
  },
  alert: {
    notice:
      'Bạn đang xem thông báo này vì bạn chưa bật thông báo từ {appName}?',
    request: 'Bạn có muốn nhận thông báo từ {appName} không?',
    title: 'Nhận thông tin',
    warning: 'Thông báo bị chặn',
    warningContent:
      'Bạn đã chặn thông báo từ {appName}. Bạn có thể bật chúng trong cài đặt trình duyệt của mình.',
  },
  on: 'Bật thông báo',
  requestPermission: 'Bật thông báo của trình duyệt để nhận thông báo',
  title: {
    SYSTEM: 'Thông báo hệ thống',
    LIKE: 'Lượt thích mới',
    COMMENT: 'Bình luận mới',
    PAYMENT_CREATED: 'Thanh toán {paymentId} đã tạo',
    PAYMENT_APPROVED: 'Thanh toán {paymentId} đã duyệt',
    PAYMENT_REJECTED: 'Thanh toán {paymentId} bị từ chối',
    PAYMENT_REOPENED: 'Thanh toán {paymentId} được mở lại',
  },
};

export { notificationsEnLang, notificationsViLang };
