import React, { useState } from 'react';
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
  XMarkIcon,
  Bars3Icon,
} from '@heroicons/react/24/outline';

const Sidebar = () => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        {/* Solid gradient background */}
        <div className="absolute inset-0 bg-[#AFC1B3]"></div>
        
        {/* Content */}
        <div className="relative flex flex-col flex-1 min-h-0">
          {/* Logo area */}
          <div className="flex items-center h-20 flex-shrink-0 px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">POS System</h1>
                <p className="text-xs text-white/70">Enterprise Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-2.5 text-sm font-medium rounded-full transition-all ${
                      isActive
                        ? 'bg-black text-white shadow-lg'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* User profile section */}
          <div className="flex-shrink-0 p-4 border-t border-white/10">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                </div>
                
                {/* User info */}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-black">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.role?.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </p>
                </div>

                {/* Logout button */}
                <button
                  onClick={logout}
                  className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                  title="Sign out"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-[#AFC1B3]">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-white">POS System</h1>
          </div>
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-white/80 hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile sidebar */}
      <div className={`
        lg:hidden fixed inset-y-0 left-0 z-40 w-72 bg-[#AFC1B3] transform transition-transform duration-300 ease-in-out
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="relative flex flex-col h-full">
          {/* Mobile logo area */}
          <div className="flex items-center h-20 flex-shrink-0 px-6 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">POS System</h1>
                <p className="text-xs text-white/70">Enterprise Management</p>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
            {filteredNavigation.map((item) => {
              const isActive = location.pathname === item.href || location.pathname.startsWith(item.href + '/');
              return (
                <NavLink
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center px-4 py-2.5 text-sm font-medium rounded-full transition-all ${
                      isActive
                        ? 'bg-black text-white shadow-lg'
                        : 'bg-white text-black hover:bg-gray-100'
                    }`
                  }
                >
                  <item.icon
                    className={`mr-3 flex-shrink-0 h-5 w-5 ${
                      isActive ? 'text-white' : 'text-gray-600'
                    }`}
                    aria-hidden="true"
                  />
                  <span className="flex-1">{item.name}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile user profile section */}
          <div className="flex-shrink-0 p-4 border-t border-white/10">
            <div className="bg-white rounded-lg p-3">
              <div className="flex items-center">
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-white font-medium">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                </div>
                
                {/* User info */}
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-black">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-600">
                    {user?.role?.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </p>
                </div>

                {/* Logout button */}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition"
                  title="Sign out"
                >
                  <ArrowRightOnRectangleIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile spacer */}
      <div className="lg:hidden h-16"></div>
    </>
  );
};

export default Sidebar;