import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';

const PageHeader = ({ title, subtitle, backLink, actions }) => {
  return (
    <div className="mb-6">
      {backLink && (
        <div className="mb-4">
          <Link
            to={backLink}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </Link>
        </div>
      )}
      
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{title}</h1>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-700">{subtitle}</p>
          )}
        </div>
        
        {actions && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;