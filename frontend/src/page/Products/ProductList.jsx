import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productApi } from '../../api/products';
import { useToast } from '../../contexts/ToastContext';
import { PencilIcon, TrashIcon, EyeIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../../common/ConfirmDialog';
import SearchInput from '../../common/SearchInput';
import Table from '../../common/Table';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, productId: null });
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, [search, pagination.currentPage]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productApi.listProducts({
        search,
        page: pagination.currentPage,
        limit: pagination.limit
      });
      setProducts(response.data.products || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination?.totalPages || 1,
        total: response.data.pagination?.total || 0
      }));
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productApi.deleteProduct(deleteDialog.productId);
      toast.success('Product deleted successfully');
      fetchProducts();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteDialog({ isOpen: false, productId: null });
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Product Name',
      render: (value, row) => (
        <div className="flex items-center">
          {row.images && row.images[0] ? (
            <img src={row.images[0]} alt={value} className="h-10 w-10 rounded-full object-cover mr-3" />
          ) : (
            <ShoppingBagIcon className="h-10 w-10 text-gray-400 mr-3" />
          )}
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">SKU: {row.sku}</div>
          </div>
        </div>
      )
    },
    {
      key: 'category',
      title: 'Category',
      render: (_, row) => row.categoryId?.name || 'N/A'
    },
    {
      key: 'price',
      title: 'Price',
      render: (value) => `GH₵ ${value?.toFixed(2)}`
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (value, row) => (
        <div>
          <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
            value > row.lowStockThreshold ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}>
            {value} units
          </span>
        </div>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Link
            to={`/products/${row._id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <EyeIcon className="h-5 w-5" />
          </Link>
          <Link
            to={`/products/${row._id}/edit`}
            className="text-yellow-600 hover:text-yellow-900"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setDeleteDialog({ isOpen: true, productId: row._id })}
            className="text-red-600 hover:text-red-900"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Products</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all products in the system
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/products/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Product
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search products..." />
      </div>

      <div className="mt-8">
        <Table
          columns={columns}
          data={products}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          emptyMessage="No products found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, productId: null })}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </div>
  );
};

export default ProductList;