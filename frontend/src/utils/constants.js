export const BUSINESS_TYPES = [
  'supermarket',
  'restaurant',
  'retail',
  'wholesale',
  'pharmacy',
  'electronics',
  'fashion',
  'other'
];

export const GHANA_REGIONS = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Northern",
  "Central", "Volta", "Brong Ahafo", "Upper East", "Upper West",
  "Western North", "Oti", "Ahafo", "Bono", "Bono East",
  "North East", "Savannah"
];

export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin'
};

export const PHONE_REGEX = /^(0|233)[2-9][0-9]{8}$/;

export const DEFAULT_PAGINATION = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 1
};