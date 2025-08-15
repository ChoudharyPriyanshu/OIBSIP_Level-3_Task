import React from 'react';
import { Pizza, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Pizza className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-bold">PizzaHub</span>
          </div>
          
          <div className="text-sm text-gray-400 flex items-center">
            Made with <Heart className="h-4 w-4 mx-1 text-red-400" /> for pizza lovers
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-6 pt-6 text-center text-sm text-gray-400">
          © 2024 PizzaHub. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;