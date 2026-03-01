export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  OWNER: 'owner',
  MANAGER: 'manager',
  CASHIER: 'cashier',
  INVENTORY: 'inventory',
};

export const ROLE_LABELS = {
  [ROLES.SUPER_ADMIN]: 'Super Admin',
  [ROLES.OWNER]: 'Owner',
  [ROLES.MANAGER]: 'Manager',
  [ROLES.CASHIER]: 'Cashier',
  [ROLES.INVENTORY]: 'Inventory Staff',
};

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  MOBILE: 'mobile',
};

export const TRANSACTION_TYPES = {
  SALE: 'sale',
  PURCHASE: 'purchase',
  RETURN: 'return',
  ADJUSTMENT: 'adjustment',
};

export const DATE_RANGES = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_QUARTER: 'this_quarter',
  THIS_YEAR: 'this_year',
  CUSTOM: 'custom',
};

export const STOCK_STATUS = {
  IN_STOCK: 'in_stock',
  LOW_STOCK: 'low_stock',
  OUT_OF_STOCK: 'out_of_stock',
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
  PRODUCTS: {
    BASE: '/products',
    BY_ID: (id) => `/products/${id}`,
  },
  SALES: {
    BASE: '/sales',
    BY_ID: (id) => `/sales/${id}`,
  },
  INVENTORY: {
    BASE: '/inventory',
    MOVEMENTS: '/inventory/movements',
  },
  REPORTS: {
    SALES: '/reports/sales',
    INVENTORY: '/reports/inventory',
    PROFIT: '/reports/profit',
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
  },
  SETTINGS: {
    BASE: '/settings',
    BUSINESS: '/settings/business',
  },
};