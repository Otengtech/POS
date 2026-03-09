import React from 'react';
import { NavLink } from 'react-router-dom';
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
    <div className="hidden h-screen md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 bg-white overflow-y-auto border-r border-gray-200">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-gray-800">POS System</h1>
        </div>
        <div className="mt-5 flex-1 flex flex-col">
          <nav className="flex-1 px-2 pb-4 space-y-1">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive
                      ? 'bg-gray-100 text-gray-900'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`
                }
              >
                <item.icon
                  className="mr-3 flex-shrink-0 h-6 w-6 text-gray-400 group-hover:text-gray-500"
                  aria-hidden="true"
                />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">{user?.firstName} {user?.lastName}</p>
              <p className="text-xs text-gray-500">{user?.role}</p>
            </div>
            <button
              onClick={logout}
              className="ml-auto flex items-center text-gray-400 hover:text-gray-500"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;