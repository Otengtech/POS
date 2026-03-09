import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { inventoryApi } from '../../api/inventory';
import { productApi } from '../../api/products';
import { useToast } from '../../contexts/ToastContext';
import PageHeader from '../../common/PageHeader';
import Card from '../../common/Card';
import SearchInput from '../../common/SearchInput';
import StatusBadge from '../../common/StatusBadge';
import LoadingSpinner from '../../common/Loader';
import {
  CubeIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  DocumentArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all, low-stock, out-of-stock
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 20
  });
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
    totalValue: 0
  });
  
  const toast = useToast();

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, [search, filter, pagination.currentPage]);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const params = {
        search,
        page: pagination.currentPage,
        limit: pagination.limit,
        ...(filter === 'low-stock' && { lowStock: true }),
        ...(filter === 'out-of-stock' && { outOfStock: true })
      };
      
      const response = await inventoryApi.getStockLevels(params);
      setInventory(response.data.inventory || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination?.totalPages || 1,
        total: response.data.pagination?.total || 0
      }));
    } catch (error) {
      toast.error('Failed to fetch inventory');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const [lowStockRes, allProductsRes] = await Promise.all([
        inventoryApi.getLowStock(),
        productApi.listProducts({ limit: 1 })
      ]);

      const totalValue = inventory.reduce((sum, item) => 
        sum + ((item.productId?.price || 0) * item.quantity), 0
      );

      setStats({
        totalProducts: allProductsRes.data.pagination?.total || 0,
        lowStock: lowStockRes.data.count || 0,
        outOfStock: inventory.filter(item => item.quantity === 0).length,
        totalValue
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleStockAdjust = async (productId, adjustment) => {
    try {
      await inventoryApi.adjustStock({
        productId,
        adjustment,
        reason: 'Manual adjustment',
        type: adjustment > 0 ? 'addition' : 'reduction'
      });
      toast.success('Stock adjusted successfully');
      fetchInventory();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
    }
  };

  const handleExport = async () => {
    try {
      const response = await inventoryApi.exportInventory();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'inventory-report.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success('Inventory exported successfully');
    } catch (error) {
      toast.error('Failed to export inventory');
    }
  };

  const filterOptions = [
    { value: 'all', label: 'All Items', icon: CubeIcon },
    { value: 'low-stock', label: 'Low Stock', icon: ExclamationTriangleIcon },
    { value: 'out-of-stock', label: 'Out of Stock', icon: ExclamationTriangleIcon }
  ];

  const statCards = [
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: CubeIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Low Stock Items',
      value: stats.lowStock,
      icon: ExclamationTriangleIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Out of Stock',
      value: stats.outOfStock,
      icon: ExclamationTriangleIcon,
      color: 'bg-red-500'
    },
    {
      name: 'Inventory Value',
      value: `GH₵ ${stats.totalValue.toFixed(2)}`,
      icon: CubeIcon,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Inventory Management"
        subtitle="Track and manage stock levels across all products"
        actions={
          <button
            onClick={handleExport}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
            Export
          </button>
        }
      />

      {/* Stats Cards */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.name} className="overflow-hidden">
            <div className="p-5">
              <div className="flex items-center">
                <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      {stat.name}
                    </dt>
                    <dd>
                      <div className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </div>
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex space-x-2">
            {filterOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setFilter(option.value)}
                className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium ${
                  filter === option.value
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <option.icon className="h-4 w-4 mr-1.5" />
                {option.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="w-full sm:w-64">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search products..."
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="mt-8">
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Value
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                ) : inventory.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No inventory items found
                    </td>
                  </tr>
                ) : (
                  inventory.map((item) => {
                    const product = item.productId || {};
                    const isLowStock = item.quantity <= (product.lowStockThreshold || 10);
                    const isOutOfStock = item.quantity === 0;
                    
                    return (
                      <tr key={item._id || product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {product.images && product.images[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                                <CubeIcon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name || 'Unknown Product'}
                              </div>
                              <div className="text-xs text-gray-500">
                                {product.brand || 'No brand'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">
                            {product.sku || 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.categoryId?.name || 'Uncategorized'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {item.quantity} units
                          </div>
                          <div className="text-xs text-gray-500">
                            Threshold: {product.lowStockThreshold || 10}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {isOutOfStock ? (
                            <StatusBadge status="out_of_stock" type="default" />
                          ) : isLowStock ? (
                            <StatusBadge status="low_stock" type="default" />
                          ) : (
                            <StatusBadge status="in_stock" type="default" />
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            GH₵ {((product.price || 0) * item.quantity).toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500">
                            @ GH₵ {product.price?.toFixed(2) || '0.00'} each
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleStockAdjust(product._id, -1)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Decrease stock"
                            >
                              <span className="text-lg font-bold">−</span>
                            </button>
                            <button
                              onClick={() => handleStockAdjust(product._id, 1)}
                              className="text-gray-400 hover:text-gray-600"
                              title="Increase stock"
                            >
                              <span className="text-lg font-bold">+</span>
                            </button>
                            <Link
                              to={`/products/${product._id}/adjust-stock`}
                              className="text-indigo-600 hover:text-indigo-900 ml-2"
                              title="Adjust stock"
                            >
                              <ArrowPathIcon className="h-4 w-4" />
                            </Link>
                          </div>
                        </td>
                      </tr>
                    );
                  })
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
                  {pagination.total} items
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

export default InventoryList;