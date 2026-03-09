import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  UserGroupIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  ArrowTrendingUpIcon,
  ExclamationCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import { businessApi } from '../../api/businesses';
import { branchApi } from '../../api/branches';
import { adminApi } from '../../api/admins';
import { productApi } from '../../api/products';
import { saleApi } from '../../api/sales';

const Dashboard = () => {
  const { user, hasRole } = useAuth();
  const [stats, setStats] = useState({
    businesses: 0,
    branches: 0,
    admins: 0,
    products: 0,
    sales: 0,
    todaySales: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get today's date range for sales
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const promises = [
        businessApi.listBusinesses({ limit: 1 }).catch(err => ({ data: { pagination: { total: 0 } } })),
        branchApi.listBranches({ limit: 1 }).catch(err => ({ data: { pagination: { total: 0 } } })),
        productApi.listProducts({ limit: 1 }).catch(err => ({ data: { pagination: { total: 0 } } })),
        saleApi.listSales({ 
          startDate: today.toISOString(),
          endDate: tomorrow.toISOString(),
          limit: 1 
        }).catch(err => ({ data: { pagination: { total: 0 }, sales: [] } }))
      ];

      if (hasRole('super_admin')) {
        promises.push(adminApi.listAdmins({ limit: 1 }).catch(err => ({ data: { pagination: { total: 0 } } })));
      } else {
        promises.push(Promise.resolve({ data: { pagination: { total: 0 } } }));
      }

      const [businessesRes, branchesRes, productsRes, salesRes, adminsRes] = await Promise.all(promises);

      const todaySales = salesRes.data.sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;

      setStats({
        businesses: businessesRes.data.pagination?.total || 0,
        branches: branchesRes.data.pagination?.total || 0,
        admins: adminsRes.data.pagination?.total || 0,
        products: productsRes.data.pagination?.total || 0,
        sales: salesRes.data.pagination?.total || 0,
        todaySales: todaySales
      });
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setError('Failed to load dashboard statistics');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const statCards = [
    {
      name: 'Total Businesses',
      value: stats.businesses,
      icon: BuildingOfficeIcon,
      gradient: 'from-blue-500 to-blue-600',
      lightGradient: 'from-blue-50 to-blue-100',
      link: '/businesses',
      roles: ['super_admin', 'admin'],
      format: (val) => val,
      description: 'Active business locations'
    },
    {
      name: 'Total Branches',
      value: stats.branches,
      icon: MapPinIcon,
      gradient: 'from-green-500 to-emerald-600',
      lightGradient: 'from-green-50 to-emerald-100',
      link: '/branches',
      roles: ['super_admin', 'admin'],
      format: (val) => val,
      description: 'Operating branches'
    },
    {
      name: 'Total Admins',
      value: stats.admins,
      icon: UserGroupIcon,
      gradient: 'from-purple-500 to-purple-600',
      lightGradient: 'from-purple-50 to-purple-100',
      link: '/admins',
      roles: ['super_admin'],
      format: (val) => val,
      description: 'System administrators'
    },
    {
      name: 'Products',
      value: stats.products,
      icon: ShoppingBagIcon,
      gradient: 'from-yellow-500 to-orange-600',
      lightGradient: 'from-yellow-50 to-orange-100',
      link: '/products',
      roles: ['super_admin', 'admin'],
      format: (val) => val,
      description: 'Active inventory items'
    },
    {
      name: "Today's Sales",
      value: stats.todaySales,
      icon: CurrencyDollarIcon,
      gradient: 'from-indigo-500 to-indigo-600',
      lightGradient: 'from-indigo-50 to-indigo-100',
      link: '/sales',
      roles: ['super_admin', 'admin'],
      format: formatCurrency,
      description: 'Revenue today'
    },
    {
      name: 'Total Transactions',
      value: stats.sales,
      icon: ArrowTrendingUpIcon,
      gradient: 'from-pink-500 to-rose-600',
      lightGradient: 'from-pink-50 to-rose-100',
      link: '/sales',
      roles: ['super_admin', 'admin'],
      format: (val) => val,
      description: 'All time transactions'
    }
  ];

  const filteredStats = statCards.filter(stat => 
    stat.roles.some(role => hasRole(role))
  );

  // Welcome message based on time of day
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Skeleton loading with luxury feel */}
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-gradient-to-r from-gray-200 to-gray-100 rounded-lg animate-pulse"></div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-200 to-gray-100 rounded-xl animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-24 animate-pulse"></div>
                    <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-100 rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-100">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <ExclamationCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-red-800 mb-2">Unable to load dashboard</h3>
              <p className="text-red-600 text-sm mb-4">{error}</p>
              <button
                onClick={fetchStats}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2">
              {getGreeting()}, {user?.firstName} {user?.lastName}
            </h1>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span className="flex items-center">
                <ClockIcon className="h-4 w-4 mr-1" />
                Last updated: {lastUpdated.toLocaleTimeString()}
              </span>
              <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
              <span className="text-gray-400">{user?.role?.replace('_', ' ')}</span>
            </div>
          </div>
          
          <button
            onClick={fetchStats}
            className="group flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-indigo-50 hover:border-indigo-200 hover:text-indigo-600 transition-all duration-200 shadow-sm"
          >
            <ArrowPathIcon className="h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500" />
            Refresh
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredStats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="group relative bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
          >
            {/* Gradient background on hover */}
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
            
            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-500 mb-1">{stat.name}</p>
                  <p className="text-3xl font-light text-gray-900 mb-2">
                    {stat.format(stat.value)}
                  </p>
                  <p className="text-xs text-gray-400">{stat.description}</p>
                </div>
                
                {/* Icon with gradient */}
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>
              
              {/* Mini trend indicator */}
              <div className="mt-4 flex items-center text-xs text-gray-400">
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
                  Real-time
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main activity feed */}
        <div className="lg:col-span-2">
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              <Link to="/reports" className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                View all →
              </Link>
            </div>
            
            <div className="space-y-4">
              {stats.sales > 0 ? (
                <>
                  <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-md mr-4">
                      <CurrencyDollarIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {stats.sales} new sale{stats.sales !== 1 ? 's' : ''} today
                      </p>
                      <p className="text-xs text-gray-400">
                        Total revenue: {formatCurrency(stats.todaySales)}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      Just now
                    </span>
                  </div>
                  
                  <div className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-transparent rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center shadow-md mr-4">
                      <BuildingOfficeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {stats.businesses} active businesses
                      </p>
                      <p className="text-xs text-gray-400">
                        Across {stats.branches} branches
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">
                      Updated
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
                    <ClockIcon className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 font-light">No recent activity to display</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/sales/new"
                className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200"
              >
                <CurrencyDollarIcon className="h-5 w-5 mr-3" />
                <span className="text-sm">New Sale</span>
              </Link>
              <Link
                to="/products/new"
                className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200"
              >
                <ShoppingBagIcon className="h-5 w-5 mr-3" />
                <span className="text-sm">Add Product</span>
              </Link>
              <Link
                to="/reports"
                className="flex items-center p-3 bg-white/10 backdrop-blur-sm rounded-xl hover:bg-white/20 transition-colors duration-200"
              >
                <ArrowTrendingUpIcon className="h-5 w-5 mr-3" />
                <span className="text-sm">View Reports</span>
              </Link>
            </div>
            
            {/* Summary */}
            <div className="mt-6 pt-6 border-t border-white/20">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-white/70">System Status</span>
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                  Operational
                </span>
              </div>
              <div className="text-xs text-white/50">
                All systems running normally
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;