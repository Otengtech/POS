import React from 'react';
import { Link } from 'react-router-dom';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

const Unauthorized = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="h-10 w-10 text-red-600" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-6">
            You don't have permission to access this page.
          </p>
          
          <div className="space-y-3">
            <Link
              to="/dashboard"
              className="block w-full px-4 py-2 bg-gradient-to-r from-[#8FA5A0] to-[#AFC1B3] text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Go to Dashboard
            </Link>
            <button
              onClick={() => window.history.back()}
              className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;