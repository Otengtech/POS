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
  ExclamationCircleIcon
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

      // Add admin fetch only if user has super_admin role
      if (hasRole('super_admin')) {
        promises.push(adminApi.listAdmins({ limit: 1 }).catch(err => ({ data: { pagination: { total: 0 } } })));
      } else {
        promises.push(Promise.resolve({ data: { pagination: { total: 0 } } }));
      }

      const [businessesRes, branchesRes, productsRes, salesRes, adminsRes] = await Promise.all(promises);

      // Calculate today's total sales
      const todaySales = salesRes.data.sales?.reduce((sum, sale) => sum + (sale.total || 0), 0) || 0;

      setStats({
        businesses: businessesRes.data.pagination?.total || 0,
        branches: branchesRes.data.pagination?.total || 0,
        admins: adminsRes.data.pagination?.total || 0,
        products: productsRes.data.pagination?.total || 0,
        sales: salesRes.data.pagination?.total || 0,
        todaySales: todaySales
      });
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
      color: 'bg-blue-500',
      link: '/businesses',
      roles: ['super_admin', 'admin'],
      format: (val) => val
    },
    {
      name: 'Total Branches',
      value: stats.branches,
      icon: MapPinIcon,
      color: 'bg-green-500',
      link: '/branches',
      roles: ['super_admin', 'admin'],
      format: (val) => val
    },
    {
      name: 'Total Admins',
      value: stats.admins,
      icon: UserGroupIcon,
      color: 'bg-purple-500',
      link: '/admins',
      roles: ['super_admin'],
      format: (val) => val
    },
    {
      name: 'Products',
      value: stats.products,
      icon: ShoppingBagIcon,
      color: 'bg-yellow-500',
      link: '/products',
      roles: ['super_admin', 'admin'],
      format: (val) => val
    },
    {
      name: "Today's Sales",
      value: stats.todaySales,
      icon: CurrencyDollarIcon,
      color: 'bg-indigo-500',
      link: '/sales',
      roles: ['super_admin', 'admin'],
      format: formatCurrency
    },
    {
      name: 'Total Transactions',
      value: stats.sales,
      icon: ArrowTrendingUpIcon,
      color: 'bg-pink-500',
      link: '/sales',
      roles: ['super_admin', 'admin'],
      format: (val) => val
    }
  ];

  const filteredStats = statCards.filter(stat => 
    stat.roles.some(role => hasRole(role))
  );

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <div className="h-8 w-48 bg-gray-200 animate-pulse rounded"></div>
            <div className="mt-2 h-4 w-64 bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>

        <div className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 rounded-md p-3 bg-gray-200 animate-pulse">
                      <div className="h-6 w-6"></div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <div className="h-4 w-24 bg-gray-200 animate-pulse rounded"></div>
                      <div className="mt-2 h-6 w-16 bg-gray-200 animate-pulse rounded"></div>
                    </div>
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
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-4">
                <button
                  type="button"
                  onClick={fetchStats}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Welcome back, {user?.firstName} {user?.lastName}!
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={fetchStats}
            className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="mt-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredStats.map((stat) => (
            <Link
              key={stat.name}
              to={stat.link}
              className="bg-white overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow duration-200"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.name}
                      </dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">
                          {stat.format(stat.value)}
                        </div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {stats.sales > 0 ? (
              <li className="px-6 py-4">
                <p className="text-sm text-gray-600">
                  {stats.sales} sale{stats.sales !== 1 ? 's' : ''} recorded today
                </p>
              </li>
            ) : (
              <li className="px-6 py-4">
                <p className="text-sm text-gray-500">No recent activity to display</p>
              </li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;