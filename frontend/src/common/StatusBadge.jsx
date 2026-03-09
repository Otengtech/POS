import React from 'react';

const StatusBadge = ({ status, type = 'default' }) => {
  const statusStyles = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    refunded: 'bg-orange-100 text-orange-800',
    paid: 'bg-green-100 text-green-800',
    unpaid: 'bg-red-100 text-red-800',
    partial: 'bg-yellow-100 text-yellow-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    default: 'bg-gray-100 text-gray-800'
  };

  const typeStyles = {
    default: 'px-2 py-0.5 text-xs rounded-full',
    dot: 'relative inline-flex items-center',
    outline: 'px-2 py-0.5 text-xs rounded-md border'
  };

  if (type === 'dot') {
    const dotColors = {
      active: 'bg-green-400',
      inactive: 'bg-red-400',
      pending: 'bg-yellow-400',
      completed: 'bg-green-400',
      cancelled: 'bg-red-400',
      default: 'bg-gray-400'
    };

    return (
      <span className="inline-flex items-center">
        <span className={`h-2 w-2 rounded-full ${dotColors[status] || dotColors.default} mr-1.5`} />
        <span className="capitalize text-sm text-gray-600">{status}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center font-medium ${statusStyles[status] || statusStyles.default} ${typeStyles[type]}`}>
      {status}
    </span>
  );
};

export default StatusBadge;