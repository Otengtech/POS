import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryApi } from '../../api/inventory';
import { useToast } from '../../contexts/ToastContext';
import PageHeader from '../../common/PageHeader';
import Card from '../../common/Card';
import SearchInput from '../../common/SearchInput';
import LoadingSpinner from '../../common/Loader';
import StatusBadge from '../../common/StatusBadge';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {
  ArrowPathIcon,
  FunnelIcon,
  CubeIcon,
  UserIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const StockMovements = () => {
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [startDate, setStartDate] = useState(new Date().setDate(1));
  const [endDate, setEndDate] = useState(new Date());
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20
  });

  const toast = useToast();

  useEffect(() => {
    fetchMovements();
  }, [search, filter, startDate, endDate, pagination.currentPage]);

  const fetchMovements = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        type: filter !== 'all' ? filter : undefined,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        page: pagination.currentPage,
        limit: pagination.limit
      };
      
      const response = await inventoryApi.getStockMovements(params);
      setMovements(response.data.movements || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination?.totalPages || 1,
        total: response.data.pagination?.total || 0
      }));
    } catch (error) {
      toast.error('Failed to fetch stock movements');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getMovementIcon = (type) => {
    switch(type) {
      case 'addition':
        return <span className="text-green-600 font-bold">+</span>;
      case 'reduction':
        return <span className="text-red-600 font-bold">−</span>;
      default:
        return <ArrowPathIcon className="h-4 w-4 text-gray-400" />;
    }
  };

  const getMovementColor = (type) => {
    switch(type) {
      case 'addition':
        return 'text-green-600 bg-green-100';
      case 'reduction':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Movements' },
    { value: 'addition', label: 'Additions' },
    { value: 'reduction', label: 'Reductions' },
    { value: 'purchase_order', label: 'Purchase Orders' },
    { value: 'sale', label: 'Sales' },
    { value: 'return', label: 'Returns' },
    { value: 'adjustment', label: 'Adjustments' }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Stock Movements"
        subtitle="Track all inventory changes and adjustments"
        backLink="/inventory"
      />

      {/* Filters */}
      <div className="mt-8 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <DatePicker
              selected={startDate}
              onChange={date => setStartDate(date)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <DatePicker
              selected={endDate}
              onChange={date => setEndDate(date)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              dateFormat="yyyy-MM-dd"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Movement Type
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              {filterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search by product..."
            />
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className="mt-8">
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <LoadingSpinner />
                    </td>
                  </tr>
                ) : movements.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No stock movements found
                    </td>
                  </tr>
                ) : (
                  movements.map((movement) => (
                    <tr key={movement._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(movement.createdAt).toLocaleDateString('en-GH')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(movement.createdAt).toLocaleTimeString('en-GH')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Link 
                          to={`/products/${movement.productId?._id}`}
                          className="flex items-center hover:text-indigo-600"
                        >
                          <CubeIcon className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {movement.productId?.name || 'Unknown Product'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {movement.productId?.sku}
                            </div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getMovementColor(movement.type)}`}>
                          {getMovementIcon(movement.type)}
                          <span className="ml-1 capitalize">
                            {movement.type?.replace('_', ' ')}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-medium ${
                          movement.quantity > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {movement.quantity > 0 ? '+' : ''}{movement.quantity}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">units</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {movement.reason || 'N/A'}
                        </div>
                        {movement.notes && (
                          <div className="text-xs text-gray-500 mt-1">
                            {movement.notes}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {movement.reference ? (
                          <Link 
                            to={movement.reference.link || '#'}
                            className="text-sm text-indigo-600 hover:text-indigo-900"
                          >
                            {movement.reference.number || movement.reference.id}
                          </Link>
                        ) : (
                          <span className="text-sm text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <UserIcon className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {movement.userId?.name || 'System'}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{' '}
                  {Math.min(pagination.currentPage * pagination.limit, pagination.total)} of{' '}
                  {pagination.total} movements
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage - 1 }))}
                    disabled={pagination.currentPage === 1}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, currentPage: prev.currentPage + 1 }))}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default StockMovements;