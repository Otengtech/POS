import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { saleApi } from '../../api/sales';
import { useToast } from '../../contexts/ToastContext';
import { EyeIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import SearchInput from '../../common/SearchInput';
import Table from '../../common/Table';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const SaleList = () => {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [startDate, setStartDate] = useState(new Date().setDate(1)); // First day of current month
  const [endDate, setEndDate] = useState(new Date());
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  });
  const toast = useToast();

  useEffect(() => {
    fetchSales();
  }, [search, pagination.currentPage, startDate, endDate]);

  const fetchSales = async () => {
    try {
      setLoading(true);
      const response = await saleApi.listSales({
        search,
        page: pagination.currentPage,
        limit: pagination.limit,
        startDate,
        endDate
      });
      setSales(response.data.sales || []);
      setPagination(prev => ({
        ...prev,
        totalPages: response.data.pagination?.totalPages || 1,
        total: response.data.pagination?.total || 0
      }));
    } catch (error) {
      toast.error('Failed to fetch sales');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      key: 'receiptNumber',
      title: 'Receipt No',
      render: (value) => (
        <span className="font-medium text-indigo-600">{value}</span>
      )
    },
    {
      key: 'date',
      title: 'Date & Time',
      render: (value) => new Date(value).toLocaleString('en-GH')
    },
    {
      key: 'customer',
      title: 'Customer',
      render: (_, row) => row.customer?.name || 'Walk-in Customer'
    },
    {
      key: 'items',
      title: 'Items',
      render: (value) => value?.length || 0
    },
    {
      key: 'total',
      title: 'Total',
      render: (value) => `GH₵ ${value?.toFixed(2)}`
    },
    {
      key: 'paymentMethod',
      title: 'Payment',
      render: (value) => (
        <span className="capitalize">{value}</span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      render: (value) => (
        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
          value === 'completed' ? 'bg-green-100 text-green-800' : 
          value === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
          'bg-red-100 text-red-800'
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
            to={`/sales/${row._id}`}
            className="text-indigo-600 hover:text-indigo-900"
          >
            <EyeIcon className="h-5 w-5" />
          </Link>
          <Link
            to={`/sales/${row._id}/receipt`}
            className="text-green-600 hover:text-green-900"
          >
            <DocumentTextIcon className="h-5 w-5" />
          </Link>
        </div>
      )
    }
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Sales</h1>
          <p className="mt-2 text-sm text-gray-700">
            View and manage all sales transactions
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/sales/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            New Sale
          </Link>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <DatePicker
            selected={startDate}
            onChange={date => setStartDate(date)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <DatePicker
            selected={endDate}
            onChange={date => setEndDate(date)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            dateFormat="yyyy-MM-dd"
          />
        </div>
        <div className="sm:col-span-1">
          <label className="block text-sm font-medium text-gray-700">Search</label>
          <SearchInput value={search} onChange={setSearch} placeholder="Search by receipt #..." />
        </div>
      </div>

      <div className="mt-8">
        <Table
          columns={columns}
          data={sales}
          loading={loading}
          pagination={pagination}
          onPageChange={(page) => setPagination(prev => ({ ...prev, currentPage: page }))}
          emptyMessage="No sales found"
        />
      </div>
    </div>
  );
};

export default SaleList;