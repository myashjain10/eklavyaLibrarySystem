// TopBar.tsx
import React from 'react';

const TopBar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <span className="text-xl font-bold">Eklavya Library</span>
          </div>
          <div className="flex items-center space-x-4">
            <a 
              href="/member/all" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
            >
              All Members
            </a>
            <a 
              href="/admin" 
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition duration-150"
            >
              Admin
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
