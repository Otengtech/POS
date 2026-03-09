import React, { useState } from 'react';
import {
  ChartBarIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  UserGroupIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const Reports = () => {
  const [startDate, setStartDate] = useState(new Date().setDate(1));
  const [endDate, setEndDate] = useState(new Date());
  const [selectedReport, setSelectedReport] = useState('sales');

  const reportTypes = [
    { id: 'sales', name: 'Sales Report', icon: CurrencyDollarIcon },
    { id: 'products', name: 'Product Report', icon: ShoppingBagIcon },
    { id: 'inventory', name: 'Inventory Report', icon: ChartBarIcon },
    { id: 'customers', name: 'Customer Report', icon: UserGroupIcon },
  ];

  const handleGenerateReport = () => {
    // Implement report generation logic
    console.log('Generating report:', selectedReport, startDate, endDate);
  };

  const handleExport = (format) => {
    // Implement export logic
    console.log('Exporting as:', format);
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Reports</h1>
          <p className="mt-2 text-sm text-gray-700">
            Generate and export business reports
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Report Type Selection */}
        <div className="lg:col-span-1">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Report Type</h3>
              <div className="mt-4 space-y-2">
                {reportTypes.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => setSelectedReport(report.id)}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      selectedReport === report.id
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <report.icon className={`mr-3 h-5 w-5 ${
                      selectedReport === report.id ? 'text-indigo-500' : 'text-gray-400'
                    }`} />
                    {report.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Report Configuration */}
        <div className="lg:col-span-3">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Report Configuration</h3>
              
              <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Start Date</label>
                  <DatePicker
                    selected={startDate}
                    onChange={date => setStartDate(date)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">End Date</label>
                  <DatePicker
                    selected={endDate}
                    onChange={date => setEndDate(date)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    dateFormat="yyyy-MM-dd"
                  />
                </div>
              </div>

              {/* Additional filters based on report type */}
              {selectedReport === 'sales' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="all">All Methods</option>
                    <option value="cash">Cash</option>
                    <option value="card">Card</option>
                    <option value="mobile_money">Mobile Money</option>
                  </select>
                </div>
              )}

              {selectedReport === 'products' && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                    <option value="all">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="food">Food</option>
                  </select>
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => handleExport('pdf')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Export PDF
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <DocumentArrowDownIcon className="h-4 w-4 mr-2" />
                  Export Excel
                </button>
                <button
                  onClick={handleGenerateReport}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Generate Report
                </button>
              </div>
            </div>
          </div>

          {/* Report Preview */}
          <div className="mt-6 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Report Preview</h3>
              
              <div className="mt-4">
                <div className="border rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500" colSpan={4}>
                          Select date range and generate report to see preview
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary Cards */}
              <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-4">
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Sales</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">GH₵ 0</dd>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Transactions</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Average Sale</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">GH₵ 0</dd>
                  </div>
                </div>
                <div className="bg-gray-50 overflow-hidden shadow rounded-lg">
                  <div className="px-4 py-5 sm:p-6">
                    <dt className="text-sm font-medium text-gray-500 truncate">Items Sold</dt>
                    <dd className="mt-1 text-3xl font-semibold text-gray-900">0</dd>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;