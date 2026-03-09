import React, { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const userNavigation = [
    { name: 'Your Profile', href: '/settings', icon: '👤', onClick: null },
    { name: 'Settings', href: '/settings', icon: '⚙️', onClick: null },
    { name: 'Sign out', href: '#', icon: '🚪', onClick: handleLogout },
  ];

  function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
  }

  // Get user initials for avatar
  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  return (
    <>
      <div className="sticky top-0 z-20 flex-shrink-0 flex h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden px-6 text-gray-500 hover:text-indigo-600 focus:outline-none transition-colors duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex-1 flex items-center justify-between px-6 lg:px-8">
          {/* Left section - Page title or breadcrumbs can go here */}
          <div className="flex-1 flex items-center">
            {/* Search bar - elegant minimal version */}
            <div className="hidden md:flex items-center max-w-md w-full">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-xl bg-white/50 backdrop-blur-sm text-sm placeholder-gray-400 focus:outline-none focus:border-indigo-300 focus:ring-1 focus:ring-indigo-200 transition-all duration-200"
                  placeholder="Search..."
                />
              </div>
            </div>
          </div>

          {/* Right section - Actions and profile */}
          <div className="flex items-center space-x-4">
            {/* Notification button with elegant badge */}
            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-indigo-600 focus:outline-none transition-colors duration-200 rounded-xl hover:bg-indigo-50"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 ring-2 ring-white"></span>
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="flex items-center space-x-3 focus:outline-none group">
                  <div className="flex items-center space-x-3">
                    {/* Avatar with gradient */}
                    <div className="relative">
                      {user?.profileImage ? (
                        <img
                          className="h-10 w-10 rounded-xl object-cover ring-2 ring-white shadow-md"
                          src={user.profileImage}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium text-sm shadow-md group-hover:shadow-lg transition-shadow duration-200">
                          {getUserInitials()}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-white"></span>
                    </div>
                    
                    {/* User info - hidden on mobile */}
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-gray-900">
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p className="text-xs text-gray-500 font-light">
                        {user?.role?.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ')}
                      </p>
                    </div>
                  </div>
                  
                  {/* Chevron indicator */}
                  <svg 
                    className="hidden lg:block h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors duration-200" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-150"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl bg-white shadow-xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden backdrop-blur-xl">
                  {/* User info header in dropdown */}
                  <div className="px-4 py-3 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 font-light">
                      {user?.email}
                    </p>
                  </div>

                  {/* Navigation items */}
                  {userNavigation.map((item) => (
                    <Menu.Item key={item.name}>
                      {({ active }) => (
                        item.href.startsWith('#') ? (
                          <button
                            onClick={item.onClick}
                            className={classNames(
                              active ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600' : 'text-gray-700',
                              'block w-full text-left px-4 py-3 text-sm transition-all duration-200 flex items-center space-x-3'
                            )}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                          </button>
                        ) : (
                          <Link
                            to={item.href}
                            className={classNames(
                              active ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-600' : 'text-gray-700',
                              'block px-4 py-3 text-sm transition-all duration-200 flex items-center space-x-3'
                            )}
                          >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                          </Link>
                        )
                      )}
                    </Menu.Item>
                  ))}

                  {/* Footer */}
                  <div className="border-t border-gray-100 px-4 py-2">
                    <p className="text-xs text-gray-400 font-light text-center">
                      Signed in securely
                    </p>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Subtle gradient line at bottom */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-indigo-200 to-transparent"></div>
    </>
  );
};

export default Header;