import React, { Fragment, useState, useEffect } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { Bars3Icon, BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../api/auth';

const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState('');

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Set greeting based on time of day
  useEffect(() => {
    const hour = currentTime.getHours();
    if (hour < 12) setGreeting('Good morning');
    else if (hour < 17) setGreeting('Good afternoon');
    else if (hour < 20) setGreeting('Good evening');
    else setGreeting('Good night');
  }, [currentTime]);

  const handleLogout = async () => {
    try {
      await authApi.logout();
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Still logout locally even if API fails
      await logout();
      navigate('/login');
    }
  };

  const userNavigation = [
    { name: 'Your Profile', href: '/profile', icon: '👤', onClick: null },
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
    if (user?.fullName) {
      return user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  // Format time
  const formatTime = () => {
    return currentTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit',
      hour12: true 
    });
  };

  // Format date
  const formatDate = () => {
    return currentTime.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Get admin name for greeting
  const getAdminName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.fullName) {
      return user.fullName;
    }
    return user?.email?.split('@')[0] || 'Administrator';
  };

  return (
    <>
      <div className="sticky top-0 z-20 flex-shrink-0 flex h-20 bg-black border-b border-[#AFC1B3]/20">
        {/* Mobile menu button */}
        <button
          type="button"
          className="lg:hidden px-6 text-gray-400 hover:text-[#AFC1B3] focus:outline-none transition-colors duration-200"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        <div className="flex-1 flex items-center justify-between px-6 lg:px-8">
          {/* Left section - Greeting and Time */}
          <div className="flex-1 flex items-center space-x-6">
            {/* Greeting */}
            <div className="hidden md:block">
              <h1 className="text-lg font-medium text-white">
                {greeting}, <span className="text-[#AFC1B3]">{getAdminName()}</span>
              </h1>
              <p className="text-xs text-gray-400 mt-0.5">
                {formatTime()} • {formatDate()}
              </p>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Notification button */}
            <button
              type="button"
              className="relative p-2 text-gray-400 hover:text-[#AFC1B3] focus:outline-none transition-colors duration-200 rounded-lg hover:bg-gray-900"
            >
              <span className="sr-only">View notifications</span>
              <BellIcon className="h-6 w-6" aria-hidden="true" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-[#AFC1B3] ring-2 ring-black"></span>
            </button>

            {/* Profile dropdown */}
            <Menu as="div" className="relative">
              <div>
                <Menu.Button className="flex items-center space-x-3 focus:outline-none group">
                  <div className="flex items-center space-x-3">
                    {/* Avatar */}
                    <div className="relative">
                      {user?.profileImage ? (
                        <img
                          className="h-10 w-10 rounded-lg object-cover ring-2 ring-gray-800"
                          src={user.profileImage}
                          alt=""
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-[#AFC1B3] flex items-center justify-center text-black font-medium text-sm">
                          {getUserInitials()}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-black"></span>
                    </div>
                    
                    {/* User info */}
                    <div className="hidden lg:block text-left">
                      <p className="text-sm font-medium text-white">
                        {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.fullName || 'Administrator'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {user?.role?.split('_').map(word => 
                          word.charAt(0).toUpperCase() + word.slice(1)
                        ).join(' ') || 'Administrator'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Chevron indicator */}
                  <svg 
                    className="hidden lg:block h-5 w-5 text-gray-500 group-hover:text-[#AFC1B3] transition-colors duration-200" 
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
                <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg bg-black border border-gray-800 shadow-2xl focus:outline-none overflow-hidden">
                  {/* User info header */}
                  <div className="px-4 py-3 border-b border-gray-800">
                    <p className="text-sm font-medium text-white">
                      {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.fullName || 'Administrator'}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {user?.email || 'admin@example.com'}
                    </p>
                    <p className="text-xs text-[#AFC1B3] mt-1">
                      {user?.role || 'Administrator'}
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
                              active ? 'bg-gray-900 text-[#AFC1B3]' : 'text-gray-300',
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
                              active ? 'bg-gray-900 text-[#AFC1B3]' : 'text-gray-300',
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
                  <div className="border-t border-gray-800 px-4 py-2">
                    <p className="text-xs text-gray-500 text-center">
                      Signed in securely
                    </p>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>

      {/* Subtle line at bottom */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-[#AFC1B3]/30 to-transparent"></div>
    </>
  );
};

export default Header;