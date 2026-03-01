export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setStoredUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
  localStorage.setItem('businessId', user.businessId);
  localStorage.setItem('branchId', user.branchId);
  localStorage.setItem('userRole', user.role);
};

export const removeStoredUser = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('businessId');
  localStorage.removeItem('branchId');
  localStorage.removeItem('userRole');
};

export const getStoredToken = () => {
  return localStorage.getItem('token');
};

export const setStoredToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeStoredToken = () => {
  localStorage.removeItem('token');
};

export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
};