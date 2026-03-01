import React, { useState } from 'react';
import { 
  FaChartLine, FaChartBar, FaChartPie, 
  FaDownload, FaCalendar, FaFilePdf, 
  FaFileExcel, FaPrint, FaTimes,
  FaChevronLeft, FaChevronRight
} from 'react-icons/fa';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, Cell
} from 'recharts';

const Reports = () => {
  const [dateRange, setDateRange] = useState('today');
  const [reportType, setReportType] = useState('sales');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Mock data
  const salesData = [
    { name: 'Mon', sales: 4000, profit: 2400 },
    { name: 'Tue', sales: 3000, profit: 1398 },
    { name: 'Wed', sales: 2000, profit: 9800 },
    { name: 'Thu', sales: 2780, profit: 3908 },
    { name: 'Fri', sales: 1890, profit: 4800 },
    { name: 'Sat', sales: 2390, profit: 3800 },
    { name: 'Sun', sales: 3490, profit: 4300 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 400 },
    { name: 'Furniture', value: 300 },
    { name: 'Clothing', value: 200 },
    { name: 'Food', value: 100 },
  ];

  const COLORS = ['#fbbf24', '#000000', '#374151', '#9ca3af'];

  const topProducts = [
    { id: 1, name: 'Laptop', sales: 45, revenue: 44999.55 },
    { id: 2, name: 'Mouse', sales: 120, revenue: 3598.80 },
    { id: 3, name: 'Keyboard', sales: 80, revenue: 7199.20 },
    { id: 4, name: 'Monitor', sales: 30, revenue: 8999.70 },
    { id: 5, name: 'Desk Chair', sales: 25, revenue: 4999.75 },
    { id: 6, name: 'Headphones', sales: 65, revenue: 6499.35 },
    { id: 7, name: 'Tablet', sales: 18, revenue: 8999.82 },
  ];

  const summaryStats = {
    totalSales: 69797.00,
    totalOrders: 300,
    averageOrderValue: 232.66,
    totalProfit: 20939.10,
  };

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
    setShowExportMenu(false);
    // Show success message
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = topProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(topProducts.length / itemsPerPage);

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Mobile Filters Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden btn-secondary flex items-center justify-center flex-1 sm:flex-none"
          >
            <FaCalendar className="mr-2" /> Filters
          </button>
          
          {/* Export Button */}
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="w-full sm:w-auto bg-black text-white mt-2 px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
            >
              <FaDownload className="mr-2" /> Export
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-20 animate-slide-down">
                <button
                  onClick={() => handleExport('pdf')}
                  className="w-full text-left px-4 py-3 hover:bg-yellow-50 flex items-center space-x-2 border-b border-gray-100"
                >
                  <FaFilePdf className="text-yellow-600" />
                  <span className="text-gray-700">PDF</span>
                </button>
                <button
                  onClick={() => handleExport('excel')}
                  className="w-full text-left px-4 py-3 hover:bg-yellow-50 flex items-center space-x-2 border-b border-gray-100"
                >
                  <FaFileExcel className="text-yellow-600" />
                  <span className="text-gray-700">Excel</span>
                </button>
                <button
                  onClick={() => handleExport('print')}
                  className="w-full text-left px-4 py-3 hover:bg-yellow-50 flex items-center space-x-2"
                >
                  <FaPrint className="text-yellow-600" />
                  <span className="text-gray-700">Print</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters - Desktop */}
      <div className={`${showMobileFilters ? 'block' : 'hidden lg:block'} bg-white p-4 rounded-xl border border-gray-200`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              <option value="sales">Sales Report</option>
              <option value="inventory">Inventory Report</option>
              <option value="profit">Profit & Loss</option>
              <option value="products">Products Report</option>
              <option value="customers">Customers Report</option>
            </select>
          </div>

          {dateRange === 'custom' && (
            <>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  End Date
                </label>
                <input 
                  type="date" 
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent" 
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-xs md:text-sm">Total Sales</p>
          <p className="text-xl md:text-2xl font-bold mt-2 text-gray-900">
            ${summaryStats.totalSales.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm text-yellow-600 mt-2 font-medium">+12.5% from last period</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-xs md:text-sm">Total Orders</p>
          <p className="text-xl md:text-2xl font-bold mt-2 text-gray-900">{summaryStats.totalOrders}</p>
          <p className="text-xs md:text-sm text-yellow-600 mt-2 font-medium">+8.3% from last period</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-xs md:text-sm">Average Order Value</p>
          <p className="text-xl md:text-2xl font-bold mt-2 text-gray-900">
            ${summaryStats.averageOrderValue.toFixed(2)}
          </p>
          <p className="text-xs md:text-sm text-yellow-600 mt-2 font-medium">+5.2% from last period</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-xs md:text-sm">Total Profit</p>
          <p className="text-xl md:text-2xl font-bold mt-2 text-gray-900">
            ${summaryStats.totalProfit.toLocaleString()}
          </p>
          <p className="text-xs md:text-sm text-yellow-600 mt-2 font-medium">+15.8% from last period</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Sales Trend */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaChartLine className="mr-2 text-yellow-400" />
            Sales Trend
          </h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Line type="monotone" dataKey="sales" stroke="#fbbf24" strokeWidth={2} />
                <Line type="monotone" dataKey="profit" stroke="#000000" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaChartPie className="mr-2 text-yellow-400" />
            Sales by Category
          </h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={window.innerWidth < 768 ? 60 : 80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '12px'
                  }} 
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Comparison */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 lg:col-span-2">
          <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FaChartBar className="mr-2 text-yellow-400" />
            Daily Sales Comparison
          </h2>
          <div className="h-64 md:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 12 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 12 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '12px'
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '12px' }} />
                <Bar dataKey="sales" fill="#fbbf24" />
                <Bar dataKey="profit" fill="#000000" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Top Selling Products</h2>
        
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-3">
          {currentItems.map(product => (
            <div key={product.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-gray-900">{product.name}</h3>
                <span className="text-yellow-600 font-semibold">${product.revenue.toFixed(2)}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-gray-500">Units Sold</p>
                  <p className="font-medium text-gray-900">{product.sales}</p>
                </div>
                <div>
                  <p className="text-gray-500">% of Total</p>
                  <p className="font-medium text-gray-900">
                    {((product.revenue / summaryStats.totalSales) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Units Sold</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Revenue</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">% of Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map(product => (
                <tr key={product.id} className="hover:bg-yellow-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                  <td className="px-6 py-4 text-gray-700">{product.sales}</td>
                  <td className="px-6 py-4 text-gray-900 font-medium">${product.revenue.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {((product.revenue / summaryStats.totalSales) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {topProducts.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, topProducts.length)} of {topProducts.length} products
            </p>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronLeft size={14} />
              </button>
              <span className="px-3 py-1 bg-yellow-400 text-black rounded-lg font-medium">
                {currentPage}
              </span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-yellow-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;