import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { branchApi } from '../../api/branches';
import { useToast } from '../../contexts/ToastContext';
import { PencilIcon, TrashIcon, EyeIcon, MapPinIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../../common/ConfirmDialog';
import SearchInput from '../../common/SearchInput';
import Table from '../../common/Table';

const BranchList = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, branchId: null });
  const toast = useToast();

  useEffect(() => {
    fetchBranches();
  }, [search, pagination.currentPage]);

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await branchApi.listBranches({
        search,
        page: pagination.currentPage,
        limit: pagination.limit
      });
      setBranches(response.data.branches || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination?.totalPages || 1,
        total: response.data.pagination?.total || 0
      }));
    } catch (error) {
      toast.error('Failed to fetch branches');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await branchApi.deleteBranch(deleteDialog.branchId);
      toast.success('Branch deleted successfully');
      fetchBranches();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete branch');
    } finally {
      setDeleteDialog({ isOpen: false, branchId: null });
    }
  };

  const columns = [
    {
      key: 'name',
      title: 'Branch Name',
      render: (value, row) => (
        <div className="flex items-center">
          <MapPinIcon className="h-5 w-5 text-gray-400 mr-2" />
          <div>
            <div className="font-medium text-gray-900">{value}</div>
            <div className="text-xs text-gray-500">{row.code}</div>
          </div>
        </div>
      )
    },
    {
      key: 'business',
      title: 'Business',
      render: (_, row) => row.businessId?.name || 'N/A'
    },
    {
      key: 'location',
      title: 'Location',
    },
    {
      key: 'phone',
      title: 'Phone',
    },
    {
      key: 'hours',
      title: 'Hours',
      render: (_, row) => `${row.opensAt} - ${row.closesAt}`
    },
    {
      key: 'isActive',
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Active' : 'Inactive'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Actions',
      render: (_, row) => (
        <div className="flex space-x-2">
          <Link
            to={`/branches/${row._id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <EyeIcon className="h-5 w-5" />
          </Link>
          <Link
            to={`/branches/${row._id}/edit`}
            className="text-yellow-600 hover:text-yellow-900"
          >
            <PencilIcon className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setDeleteDialog({ isOpen: true, branchId: row._id })}
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
          <h1 className="text-xl font-semibold text-gray-900">Branches</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all branches in the system
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/branches/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Branch
          </Link>
        </div>
      </div>

      <div className="mt-4">
        <SearchInput value={search} onChange={setSearch} placeholder="Search branches..." />
      </div>

      <div className="mt-8">
        <Table
          columns={columns}
          data={branches}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          emptyMessage="No branches found"
        />
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, branchId: null })}
        onConfirm={handleDelete}
        title="Delete Branch"
        message="Are you sure you want to delete this branch? This action cannot be undone."
      />
    </div>
  );
};

export default BranchList;