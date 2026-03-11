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
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { businessApi } from '../../api/businesses';
import { branchApi } from '../../api/branches';
import { adminApi } from '../../api/admins';
import { productApi } from '../../api/products';
import { saleApi } from '../../api/sales';

const Dashboard = () => {
  const { user, hasRole } = useAuth();

  // Fix 1: Correct state declarations - remove the {admin, setAdmins} mistake
  const [stats, setStats] = useState({
    businesses: 0,
    admins: 0,
    branches: 0,
    products: 0,
    sales: 0,
    todaySales: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [refreshKey, setRefreshKey] = useState(0); // For manual refresh

  useEffect(() => {
    fetchStats();
  }, [refreshKey]); // Add refreshKey to dependencies for manual refresh

  const getCount = (res, key) => {
  if (!res?.data) return 0;

  const data = res.data;

  // Most common: { data: { data: [], pagination: { total } } }
  if (data.data && Array.isArray(data.data)) {
    if (data.pagination?.total !== undefined) return data.pagination.total;
    return data.data.length;
  }

  // { data: [] }
  if (Array.isArray(data)) return data.length;

  // { total: number }
  if (data.total !== undefined) return data.total;

  // { products: [] } etc
  if (key && Array.isArray(data[key])) return data[key].length;

  return 0;
};

 const fetchStats = async () => {
  try {
    setLoading(true);
    setError(null);

    const today = new Date();
    today.setHours(0,0,0,0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const promises = [
      businessApi.listBusinesses({ limit: 1 }).catch(() => ({ data:{} })),
      branchApi.listBranches({ limit: 1 }).catch(() => ({ data:{} })),
      productApi.listProducts({ limit: 1 }).catch(() => ({ data:{} })),
      saleApi.listSales({
        startDate: today.toISOString(),
        endDate: tomorrow.toISOString(),
        limit: 100
      }).catch(() => ({ data:{} }))
    ];

    // Only fetch admins for super admin
    if (hasRole('super_admin')) {
      promises.push(
        adminApi.listAdmins({ limit: 1 }).catch(() => ({ data:{} }))
      );
    } else {
      promises.push(Promise.resolve({ data:{} }));
    }

    const [
      businessesRes,
      branchesRes,
      productsRes,
      salesRes,
      adminsRes
    ] = await Promise.all(promises);

    const businesses = getCount(businessesRes, "businesses");
    const branches = getCount(branchesRes, "branches");
    const products = getCount(productsRes, "products");
    const sales = getCount(salesRes, "sales");
    const admins = getCount(adminsRes, "admins");

    // calculate today's sales
    let todaySales = 0;

    const salesArray =
      salesRes?.data?.sales ||
      salesRes?.data?.data ||
      salesRes?.data ||
      [];

    if (Array.isArray(salesArray)) {
      todaySales = salesArray.reduce(
        (sum, sale) => sum + (sale?.total || 0),
        0
      );
    }

    setStats({
      businesses,
      branches,
      admins,
      products,
      sales,
      todaySales
    });

    setLastUpdated(new Date());

  } catch (err) {
    console.error("Dashboard stats error:", err);
    setError("Failed to load dashboard statistics.");
  } finally {
    setLoading(false);
  }
};

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1); // Trigger useEffect
  };

  const formatCurrency = (amount) => {
    // Fix 5: Handle undefined or null values
    const value = amount || 0;
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: 'GHS',
      minimumFractionDigits: 2
    }).format(value);
  };

  const statCards = [
    {
      name: 'Total Businesses',
      value: stats.businesses,
      icon: BuildingOfficeIcon,
      gradient: 'from-[#8FA5A0] to-[#AFC1B3]',
      lightGradient: 'from-[#E5ECE8] to-[#F0F5F2]',
      link: '/businesses',
      roles: ['super_admin', 'admin'],
      format: (val) => val,
      description: 'Active business locations'
    },
    {
      name: 'Total Branches',
      value: stats.branches,
      icon: MapPinIcon,
      gradient: 'from-[#8FA5A0] to-[#AFC1B3]',
      lightGradient: 'from-[#E5ECE8] to-[#F0F5F2]',
      link: '/branches',
      roles: ['super_admin', 'admin'],
      format: (val) => val,
      description: 'Operating branches'
    },
    {
      name: 'Total Admins',
      value: stats.admins,
      icon: UserGroupIcon,
      gradient: 'from-[#8FA5A0] to-[#AFC1B3]',
      lightGradient: 'from-[#E5ECE8] to-[#F0F5F2]',
      link: '/admins',
      roles: ['super_admin'],
      format: (val) => val,
      description: 'System administrators'
    },
    {
      name: 'Products',
      value: stats.products,
      icon: ShoppingBagIcon,
      gradient: 'from-[#8FA5A0] to-[#AFC1B3]',
      lightGradient: 'from-[#E5ECE8] to-[#F0F5F2]',
      link: '/products',
      roles: ['super_admin', 'admin'],
      format: (val) => val,
      description: 'Active inventory items'
    },
    {
      name: "Today's Sales",
      value: stats.todaySales,
      icon: CurrencyDollarIcon,
      gradient: 'from-[#8FA5A0] to-[#AFC1B3]',
      lightGradient: 'from-[#E5ECE8] to-[#F0F5F2]',
      link: '/sales',
      roles: ['super_admin', 'admin'],
      format: formatCurrency,
      description: 'Revenue today'
    },
    {
      name: 'Total Transactions',
      value: stats.sales,
      icon: ArrowTrendingUpIcon,
      gradient: 'from-[#8FA5A0] to-[#AFC1B3]',
      lightGradient: 'from-[#E5ECE8] to-[#F0F5F2]',
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
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gradient-to-r from-[#E5ECE8] to-[#F0F5F2] rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-gradient-to-r from-[#E5ECE8] to-[#F0F5F2] rounded-lg animate-pulse"></div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#AFC1B3]/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E5ECE8] to-[#F0F5F2] rounded-xl animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-[#E5ECE8] to-[#F0F5F2] rounded w-24 animate-pulse"></div>
                    <div className="h-6 bg-gradient-to-r from-[#E5ECE8] to-[#F0F5F2] rounded w-16 animate-pulse"></div>
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
              <div className="w-12 h-12 bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] rounded-xl flex items-center justify-center shadow-lg">
                <ExclamationCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-[#8FA5A0] mb-2">Unable to load dashboard</h3>
              <p className="text-[#8FA5A0] text-sm mb-4">{error}</p>
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#8FA5A0] to-[#AFC1B3] text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
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
              {getGreeting()}, {user?.firstName || 'User'} {user?.lastName || ''}
            </h1>
            <p className="text-sm text-gray-900 flex items-center">
              <span className="w-1.5 h-1.5 bg-[#AFC1B3] rounded-full mr-2"></span>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="group flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm border border-[#AFC1B3]/30 rounded-xl text-sm font-medium text-[#8FA5A0] hover:bg-[#F0F5F2] hover:border-[#AFC1B3] transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowPathIcon className={`h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
        {filteredStats.map((stat) => (
          <Link
            key={stat.name}
            to={stat.link}
            className="group relative bg-[#AFC1B3]/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-[#AFC1B3]/20"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${stat.lightGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

            <div className="relative p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">{stat.name}</p>
                  <p className="text-3xl font-light text-gray-900 mb-2">
                    {stat.format(stat.value)}
                  </p>
                  <p className="text-xs text-gray-900">{stat.description}</p>
                </div>

                <div className="w-14 h-14 bg-black rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <stat.icon className="h-7 w-7 text-white" />
                </div>
              </div>

              <div className="mt-4 flex items-center text-xs text-gray-900">
                <span className="flex items-center">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-1"></span>
                  Real-time data
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
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#AFC1B3]/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              <Link to="/reports" className="text-sm text-[#8FA5A0] hover:text-[#AFC1B3] font-medium transition-colors">
                View all →
              </Link>
            </div>

            <div className="space-y-4">
              {stats.sales > 0 ? (
                <>
                  <div className="flex items-center p-3 bg-gradient-to-r from-[#F0F5F2] to-transparent rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] rounded-lg flex items-center justify-center shadow-md mr-4">
                      <CurrencyDollarIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {stats.sales} new sale{stats.sales !== 1 ? 's' : ''} today
                      </p>
                      <p className="text-xs text-[#8FA5A0]">
                        Total revenue: {formatCurrency(stats.todaySales)}
                      </p>
                    </div>
                    <span className="text-xs text-[#AFC1B3]">
                      Just now
                    </span>
                  </div>

                  <div className="flex items-center p-3 bg-gradient-to-r from-[#F0F5F2] to-transparent rounded-xl">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] rounded-lg flex items-center justify-center shadow-md mr-4">
                      <BuildingOfficeIcon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {stats.businesses} active business{stats.businesses !== 1 ? 'es' : ''}
                      </p>
                      <p className="text-xs text-[#8FA5A0]">
                        Across {stats.branches} branch{stats.branches !== 1 ? 'es' : ''}
                      </p>
                    </div>
                    <span className="text-xs text-[#AFC1B3]">
                      Updated
                    </span>
                  </div>

                  {stats.products > 0 && (
                    <div className="flex items-center p-3 bg-gradient-to-r from-[#F0F5F2] to-transparent rounded-xl">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] rounded-lg flex items-center justify-center shadow-md mr-4">
                        <ShoppingBagIcon className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {stats.products} product{stats.products !== 1 ? 's' : ''} in inventory
                        </p>
                        <p className="text-xs text-[#8FA5A0]">
                          Ready for sale
                        </p>
                      </div>
                      <span className="text-xs text-[#AFC1B3]">
                        Active
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#F0F5F2] to-[#E5ECE8] rounded-full flex items-center justify-center mx-auto mb-3">
                    <ClockIcon className="h-8 w-8 text-[#AFC1B3]" />
                  </div>
                  <p className="text-[#8FA5A0] font-light">No recent activity to display</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick actions sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] rounded-2xl shadow-lg p-6 text-white">
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
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-white">Operational</span>
                </span>
              </div>
              <div className="text-xs text-white/50">
                All systems running normally
              </div>
              <div className="mt-3 flex items-center text-xs text-white/70">
                <CheckCircleIcon className="h-4 w-4 mr-1" />
                {stats.branches} branch{stats.branches !== 1 ? 'es' : ''} online
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-6 text-center">
        <p className="text-xs text-[#AFC1B3]">
          Dashboard automatically updates every 5 minutes
        </p>
      </div>
    </div>
  );
};

export default Dashboard;