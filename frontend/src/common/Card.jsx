import React from 'react';

const Card = ({ children, title, subtitle, actions, className = '', noPadding = false }) => {
  return (
    <div className={`bg-white shadow sm:rounded-lg ${className}`}>
      {(title || subtitle || actions) && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              {title && <h3 className="text-lg font-medium leading-6 text-gray-900">{title}</h3>}
              {subtitle && <p className="mt-1 max-w-2xl text-sm text-gray-500">{subtitle}</p>}
            </div>
            {actions && <div>{actions}</div>}
          </div>
        </div>
      )}
      <div className={noPadding ? '' : 'px-4 py-5 sm:p-6'}>
        {children}
      </div>
    </div>
  );
};

export default Card;