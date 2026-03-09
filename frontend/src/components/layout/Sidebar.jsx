import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  HomeIcon,
  UserGroupIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  ShoppingBagIcon,
  DocumentTextIcon,
  ChartBarIcon,
  CogIcon,
  ArchiveBoxIcon,
  CurrencyDollarIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, roles: ['super_admin', 'admin'] },
    { name: 'Admins', href: '/admins', icon: UserGroupIcon, roles: ['super_admin'] },
    { name: 'Businesses', href: '/businesses', icon: BuildingOfficeIcon, roles: ['super_admin', 'admin'] },
    { name: 'Branches', href: '/branches', icon: MapPinIcon, roles: ['super_admin', 'admin'] },
    { name: 'Products', href: '/products', icon: ShoppingBagIcon, roles: ['super_admin', 'admin'] },
    { name: 'Sales', href: '/sales', icon: CurrencyDollarIcon, roles: ['super_admin', 'admin'] },
    { name: 'Inventory', href: '/inventory', icon: ArchiveBoxIcon, roles: ['super_admin', 'admin'] },
    { name: 'Reports', href: '/reports', icon: ChartBarIcon, roles: ['super_admin', 'admin'] },
    { name: 'Settings', href: '/settings', icon: CogIcon, roles: ['super_admin', 'admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.some(role => hasRole(role))
  );

  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
        {/* Glass background */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/60 backdrop-blur-xl border-r border-white/20 shadow-2xl"></div>
        
        {/* Content */}
        <div className="relative flex flex-col flex-1 min-h-0">
          {/* Logo area with gradient */}
          <div className="flex items-center h-20 flex-shrink-0 px-6 border-b border-gray-100/50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-light tracking-wide text-gray-900">POS System</h1>
                <p className="text-xs text-gray-500 font-light">Enterprise Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-3 text-sm font-light rounded-2xl transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600 shadow-sm'
                        : 'text-gray-600 hover:bg-gray-50/80 hover:text-gray-900'
                    }`
                  }
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 transition-colors duration-200 ${
                      isActive ? 'text-indigo-600' : 'text-gray-400 group-hover:text-gray-500'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* User profile section */}
          <div className="flex-shrink-0 p-4 border-t border-gray-100/50">
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-4 shadow-sm">
              <div className="flex items-center">
                {/* Avatar with gradient */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-md flex items-center justify-center text-white font-medium text-lg">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                </div>
                
                {/* User info */}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500 font-light mt-0.5">
                    {user?.role?.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </p>
                </div>

                {/* Logout button */}
                <button
                  onClick={logout}
                  className="p-2 text-gray-400 hover:text-indigo-600 transition-colors duration-200 rounded-lg hover:bg-indigo-50"
                  title="Sign out"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header - simplified but still luxurious */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-10 bg-white/80 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg shadow flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-light text-gray-900">POS System</h1>
          </div>
          <button className="p-2 text-gray-400 hover:text-indigo-600">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
      {/* Mobile spacer */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Sidebar;