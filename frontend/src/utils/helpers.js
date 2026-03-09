export const formatCurrency = (amount, currency = 'GH₵') => {
  return `${currency} ${amount?.toFixed(2) || '0.00'}`;
};

export const formatDate = (date, options = {}) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-GH', options);
};

export const formatTime = (time) => {
  if (!time) return '';
  return time;
};

export const capitalizeFirst = (string) => {
  if (!string) return '';
  return string.charAt(0).toUpperCase() + string.slice(1);
};

export const truncateText = (text, length = 50) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const getInitials = (firstName, lastName) => {
  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
};