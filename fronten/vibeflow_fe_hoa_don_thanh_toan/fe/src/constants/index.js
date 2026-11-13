/**
 * VibeFlow Sneaker - Global Application Constants
 * Standard International Enums & System Constants
 */

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  STAFF: 'NHAN_VIEN',
  CUSTOMER: 'KHACH_HANG',
};

export const STAFF_ROLES = [USER_ROLES.ADMIN, USER_ROLES.STAFF];

export const ORDER_TYPES = {
  ONLINE: 'ONLINE',
  INSTORE: 'TAI_QUAY',
};

export const ORDER_STATUS = {
  PENDING: {
    code: 'CHO_XAC_NHAN',
    label: 'Chờ xác nhận',
    color: 'amber',
    badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  PROCESSING: {
    code: 'CHO_GIAO_HANG',
    label: 'Chờ giao hàng',
    color: 'blue',
    badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  SHIPPING: {
    code: 'DANG_GIAO',
    label: 'Đang giao hàng',
    color: 'indigo',
    badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  },
  COMPLETED: {
    code: 'HOAN_THANH',
    label: 'Hoàn thành',
    color: 'emerald',
    badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  CANCELLED: {
    code: 'DA_HUY',
    label: 'Đã hủy',
    color: 'rose',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
  },
};

export const PAYMENT_METHODS = {
  CASH: {
    code: 'TIEN_MAT',
    label: 'Tiền mặt',
    icon: 'BanknotesIcon',
  },
  BANK_TRANSFER: {
    code: 'CHUYEN_KHOAN',
    label: 'Chuyển khoản (VietQR)',
    icon: 'QrCodeIcon',
  },
  COD: {
    code: 'COD',
    label: 'Thanh toán khi nhận hàng',
    icon: 'TruckIcon',
  },
};

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Re-export admin-specific constants for backwards compatibility
export * from '../components/admin/constants';
