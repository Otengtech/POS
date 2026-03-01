import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiHome,
  FiPackage,
  FiShoppingCart,
  FiClipboard,
  FiPieChart,
  FiUsers,
  FiSettings,
  FiLogOut
} from 'react-icons/fi';
import { BiStore } from 'react-icons/bi';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FiHome, roles: ['*'] },
    { path: '/products', label: 'Products', icon: FiPackage, roles: ['*','super_admin', 'owner', 'manager', 'inventory'] },
    { path: '/sales', label: 'Sales', icon: FiShoppingCart, roles: ['*','super_admin', 'owner', 'manager', 'cashier'] },
    { path: '/inventory', label: 'Inventory', icon: FiClipboard, roles: ['*','super_admin', 'owner', 'manager', 'inventory'] },
    { path: '/reports', label: 'Reports', icon: FiPieChart, roles: ['*','super_admin', 'owner', 'manager'] },
    { path: '/users', label: 'Users', icon: FiUsers, roles: ['*','super_admin', 'owner'] },
    { path: '/settings', label: 'Settings', icon: FiSettings, roles: ['*','super_admin', 'owner'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes('*') || (user && item.roles.includes(user.role))
  );

  return (
    <div className="h-full w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-xl flex flex-col overflow-y-auto">
      {/* Logo Area */}
      <div className="p-5 border-b border-gray-700/50">
        <div className="flex items-center space-x-3">
          <div className="bg-yellow-400 p-2 rounded-lg">
            <BiStore className="w-6 h-6 text-black" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">POS System</h1>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                      isActive 
                        ? 'bg-yellow-400 text-black shadow-md shadow-yellow-400/30' 
                        : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
                    }`
                  }
                >
                  <Icon className={`w-5 h-5 ${({ isActive }) => isActive ? 'text-black' : 'text-gray-400 group-hover:text-white'}`} />
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Info & Logout */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex items-center space-x-3 mb-3 px-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 flex items-center justify-center">
            <span className="text-sm font-medium text-black">
              {user?.name?.charAt(0) || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-400 truncate capitalize">{user?.role?.replace('_', ' ') || 'Loading...'}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 group"
        >
          <FiLogOut className="w-5 h-5 text-gray-400 group-hover:text-red-400" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;