import React from 'react';
import { Pizza } from 'lucide-react';

const Loader = ({ size = 'default', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-4 w-4',
    default: 'h-8 w-8',
    large: 'h-12 w-12',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="animate-spin mb-4">
        <Pizza className={`${sizeClasses[size]} text-blue-600`} />
      </div>
      <p className="text-gray-600 text-sm">{text}</p>
    </div>
  );
};

export const PageLoader = () => {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader size="large" text="Loading..." />
    </div>
  );
};

export const ButtonLoader = () => {
  return (
    <div className="animate-spin">
      <Pizza className="h-4 w-4" />
    </div>
  );
};

export default Loader;