import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaShoppingCart, FaBox, FaUsers, FaDollarSign, FaClock, FaExclamationTriangle } from 'react-icons/fa';

const Dashboard = () => {
  const { userRole, businessId, branchId } = useAuth();

  const stats = [
    { title: "Today's Sales", value: '$12,345', icon: FaDollarSign, change: '+12%', trend: 'up' },
    { title: 'Products', value: '1,234', icon: FaBox, change: '+5%', trend: 'up' },
    { title: 'Orders', value: '156', icon: FaShoppingCart, change: '+8%', trend: 'up' },
    { title: 'Customers', value: '892', icon: FaUsers, change: '+15%', trend: 'up' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header - Minimal */}
      <div className="mb-6 sm:mb-8 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-black">
              Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, {userRole}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Business</span>
              <span className="font-mono font-medium text-black bg-gray-100 px-2 py-1 rounded">
                {businessId}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-400">Branch</span>
              <span className="font-mono font-medium text-black bg-gray-100 px-2 py-1 rounded">
                {branchId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid - Clean & Compact */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6 sm:mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-lg p-5 hover:border-black transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {stat.title}
                </p>
                <p className="text-2xl font-light text-black mt-1">
                  {stat.value}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <span className="text-xs text-gray-600">
                    {stat.change}
                  </span>
                  <span className="text-xs text-gray-400">
                    vs yesterday
                  </span>
                </div>
              </div>
              <div className="p-2 bg-gray-100 rounded-md">
                <stat.icon className="text-black text-lg" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6">
        {/* Recent Sales */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaClock className="text-gray-400 text-sm" />
              <h2 className="text-sm font-medium text-black uppercase tracking-wider">
                Recent Sales
              </h2>
            </div>
            <button className="text-xs text-gray-500 hover:text-black transition-colors">
              View All →
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-black">Order #POS-{1000 + item}</p>
                  <p className="text-xs text-gray-400 mt-0.5">2 minutes ago • Cash</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-black">${(45 + item * 5).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaExclamationTriangle className="text-gray-400 text-sm" />
              <h2 className="text-sm font-medium text-black uppercase tracking-wider">
                Low Stock Alert
              </h2>
            </div>
            <button className="text-xs text-gray-500 hover:text-black transition-colors">
              Manage Stock →
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { name: 'Wireless Mouse', sku: 'MSE-001', stock: 3, threshold: 10 },
              { name: 'HDMI Cable', sku: 'CBL-002', stock: 5, threshold: 15 },
              { name: 'USB Drive 32GB', sku: 'USB-003', stock: 2, threshold: 20 },
              { name: 'Laptop Stand', sku: 'STD-004', stock: 1, threshold: 8 },
            ].map((item, index) => (
              <div key={index} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div>
                  <p className="text-sm font-medium text-black">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${item.stock <= 2 ? 'text-black' : 'text-gray-600'}`}>
                    {item.stock} / {item.threshold}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">remaining</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions - Optional */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            Last updated: Just now
          </p>
          <div className="flex items-center gap-3">
            <button className="text-xs text-gray-500 hover:text-black transition-colors">
              Refresh
            </button>
            <span className="text-gray-200">|</span>
            <button className="text-xs text-gray-500 hover:text-black transition-colors">
              Download Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;