const transactionsEnLang = {
  newBalance: 'New balance',
  create: 'Create transaction',
  types: {
    SYSTEM: 'System',
    PAYMENT: 'Payment',
    REFUND: 'Refund',
    TRANSFER: 'Transfer',
    REWARD: 'Reward',
    WITHDRAW: 'Withdraw',
    CONVERT: 'Convert',
  },
  error: {
    not_found: 'Transaction not found',
    not_pending: 'Transaction is not pending',
    invalid_amount: 'Invalid amount',
  },
};
const transactionsViLang = {
  newBalance: 'Số dư mới',
  create: 'Tạo giao dịch',
  types: {
    SYSTEM: 'Hệ thống',
    PAYMENT: 'Thanh toán',
    REFUND: 'Hoàn tiền',
    TRANSFER: 'Chuyển',
    REWARD: 'Thưởng',
    WITHDRAW: 'Rút',
    CONVERT: 'Quy đổi',
  },
  error: {
    not_found: 'Không tìm thấy giao dịch',
    not_pending: 'Giao dịch không ở trạng thái chờ xử lý',
    invalid_amount: 'Số tiền không hợp lệ',
  },
};

export { transactionsEnLang, transactionsViLang };
