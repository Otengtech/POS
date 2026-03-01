import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { FaUserCircle, FaBell } from 'react-icons/fa';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="bg-white shadow-sm h-16 fixed top-0 right-0 left-64 transition-all duration-300 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome back, {user?.name || 'User'}!
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:text-yellow-500 transition-colors">
            <FaBell className="text-xl" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <FaUserCircle className="text-3xl text-gray-600" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;