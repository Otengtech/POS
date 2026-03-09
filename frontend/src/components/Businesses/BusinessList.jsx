import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { businessApi } from '../../api/businesses';
import { useToast } from '../../contexts/ToastContext';
import { PencilIcon, TrashIcon, EyeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../../common/ConfirmDialog';
import SearchInput from '../../common/SearchInput';
import Table from '../../common/Table';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, businessId: null });
  const toast = useToast();

  useEffect(() => {
    fetchBusinesses();
  }, [search, pagination.currentPage]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const response = await businessApi.listBusinesses({
        search,
        page: pagination.currentPage,
        limit: pagination.limit
      });
      setBusinesses(response.data.businesses || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination?.totalPages || 1,
        total: response.data.pagination?.total || 0
      }));
    } catch (error) {
      toast.error('Failed to fetch businesses');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await businessApi.deleteBusiness(deleteDialog.businessId);
      toast.success('Business deleted successfully');
      fetchBusinesses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete business');
    } finally {
      setDeleteDialog({ isOpen: false, businessId: null });
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Business Name',
      render: (value, row) => (
        <div className="flex items-center">
          <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.code}</div>
          </div>
        </div>
      )
    },
    {
      key: 'email',
      title: 'Email',
    },
    {
      key: 'phone',
      title: 'Phone',
    },
    {
      key: 'businessType',
      title: 'Type',
      render: (value) => (
        <span className="capitalize">{value}</span>
      )
    },
    {
      key: 'taxRate',
      title: 'Tax Rate',
      render: (value) => `${value}%`
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Link
            to={`/businesses/${row._id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <EyeIcon className="h-5 w-5" />
          </Link>
          <Link
            to={`/businesses/${row._id}/edit`}
            className="text-yellow-600 hover:text-yellow-900"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setDeleteDialog({ isOpen: true, businessId: row._id })}
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
          <h1 className="text-xl font-semibold text-gray-900">Businesses</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all businesses in the system
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/businesses/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Business
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search businesses..." />
      </div>

      <div className="mt-8">
        <Table
          columns={columns}
          data={businesses}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          emptyMessage="No businesses found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, businessId: null })}
        onConfirm={handleDelete}
        title="Delete Business"
        message="Are you sure you want to delete this business? This action cannot be undone and will affect all associated branches and data."
      />
    </div>
  );
};

export default BusinessList;