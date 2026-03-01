import React from 'react';
import { FaSpinner } from 'react-icons/fa';

const LoadingSpinner = ({ size = 'md', fullPage = false, text = 'Loading...' }) => {
  const sizes = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  const spinnerSizes = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  if (fullPage) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            {/* Outer ring */}
            <div className={`${spinnerSizes[size]} border-2 border-gray-200 rounded-full`}></div>
            {/* Spinning inner ring */}
            <div className={`${spinnerSizes[size]} absolute top-0 left-0 border-2 border-yellow-400 rounded-full animate-spin`} style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }}></div>
            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-2 h-2 bg-black rounded-full"></div>
            </div>
          </div>
          {text && (
            <p className={`mt-4 ${textSizes[size]} font-medium text-gray-700`}>
              {text}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="relative">
        {/* Simple spinner for inline usage */}
        <FaSpinner className={`${sizes[size]} text-yellow-400 animate-spin`} />
        {/* Optional overlay shadow for depth */}
        <FaSpinner className={`${sizes[size]} absolute top-0 left-0 text-gray-200 animate-pulse`} style={{ opacity: 0.3 }} />
      </div>
      {text && (
        <p className={`mt-2 ${textSizes[size]} text-gray-600`}>{text}</p>
      )}
    </div>
  );
};

// Additional variant for skeleton loading
export const SkeletonLoader = ({ type = 'card', count = 1 }) => {
  const skeletons = {
    card: (
      <div className="bg-white border border-gray-200 rounded-lg p-4 animate-pulse">
        <div className="aspect-square bg-gray-200 rounded-lg mb-3"></div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>
    ),
    line: (
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded w-full"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        <div className="h-4 bg-gray-200 rounded w-4/6"></div>
      </div>
    ),
    table: (
      <div className="space-y-3">
        <div className="h-8 bg-gray-200 rounded w-full"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
        <div className="h-8 bg-gray-200 rounded w-full"></div>
      </div>
    ),
    profile: (
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    ),
  };

  return (
    <div className="space-y-4">
      {[...Array(count)].map((_, index) => (
        <div key={index}>
          {skeletons[type] || skeletons.card}
        </div>
      ))}
    </div>
  );
};

// Button loading spinner
export const ButtonSpinner = ({ color = 'yellow' }) => {
  const colorClasses = {
    yellow: 'border-yellow-400 border-t-transparent',
    white: 'border-white border-t-transparent',
    black: 'border-black border-t-transparent',
  };

  return (
    <div className="inline-flex items-center">
      <div className={`w-4 h-4 border-2 ${colorClasses[color]} rounded-full animate-spin mr-2`}></div>
      <span>Loading...</span>
    </div>
  );
};

// Page transition loader
export const PageLoader = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="w-12 h-12 border-4 border-gray-200 rounded-full"></div>
            <div className="w-12 h-12 border-4 border-yellow-400 rounded-full absolute top-0 left-0 animate-spin" style={{ borderTopColor: 'transparent', borderRightColor: 'transparent' }}></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Loading</h3>
            <p className="text-sm text-gray-500">Please wait...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading dots animation
export const LoadingDots = ({ color = 'yellow' }) => {
  const dotColor = color === 'yellow' ? 'bg-yellow-400' : 'bg-black';
  
  return (
    <div className="flex space-x-1">
      <div className={`w-2 h-2 ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '0ms' }}></div>
      <div className={`w-2 h-2 ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '150ms' }}></div>
      <div className={`w-2 h-2 ${dotColor} rounded-full animate-bounce`} style={{ animationDelay: '300ms' }}></div>
    </div>
  );
};

export default LoadingSpinner;