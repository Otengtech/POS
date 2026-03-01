import React, { useState, useEffect } from 'react';
import { 
  FaBoxes, FaExclamationTriangle, FaPlus, FaMinus,
  FaSearch, FaDownload, FaFilePdf, FaFileExcel,
  FaPrint, FaChevronLeft, FaChevronRight, FaTimes,
  FaWarehouse, FaChartLine
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Inventory = () => {
  const { user } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showStockModal, setShowStockModal] = useState(false);
  const [stockAction, setStockAction] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const itemsPerPage = 5;

  useEffect(() => {
    setTimeout(() => {
      setInventory([
        { id: 1, name: 'Laptop Pro', sku: 'LAP001', stock: 15, minStock: 5, maxStock: 50, unit: 'pcs', location: 'A1', category: 'Electronics', price: 1299.99 },
        { id: 2, name: 'Wireless Mouse', sku: 'MOU001', stock: 50, minStock: 10, maxStock: 100, unit: 'pcs', location: 'A2', category: 'Accessories', price: 29.99 },
        { id: 3, name: 'Mechanical Keyboard', sku: 'KEY001', stock: 30, minStock: 8, maxStock: 80, unit: 'pcs', location: 'A3', category: 'Accessories', price: 89.99 },
        { id: 4, name: '4K Monitor', sku: 'MON001', stock: 8, minStock: 5, maxStock: 30, unit: 'pcs', location: 'B1', category: 'Electronics', price: 399.99 },
        { id: 5, name: 'Ergonomic Chair', sku: 'CHR001', stock: 3, minStock: 3, maxStock: 20, unit: 'pcs', location: 'C1', category: 'Furniture', price: 249.99 },
        { id: 6, name: 'Headphones', sku: 'HDP001', stock: 25, minStock: 8, maxStock: 60, unit: 'pcs', location: 'A4', category: 'Accessories', price: 79.99 },
        { id: 7, name: 'Tablet', sku: 'TAB001', stock: 12, minStock: 5, maxStock: 40, unit: 'pcs', location: 'B2', category: 'Electronics', price: 499.99 },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStockUpdate = () => {
    if (!quantity || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    toast.custom((t) => (
      <div className="bg-white px-6 py-4 shadow-xl rounded-xl border border-gray-200 flex items-center gap-4">
        <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
          <FaBoxes className="w-5 h-5 text-black" />
        </div>
        <div>
          <p className="font-medium text-gray-900">Stock Updated</p>
          <p className="text-sm text-gray-500">{quantity} units {stockAction === 'add' ? 'added to' : 'removed from'} {selectedProduct?.name}</p>
        </div>
      </div>
    ));

    setShowStockModal(false);
    setQuantity('');
    setSelectedProduct(null);
  };

  const handleExport = (format) => {
    console.log(`Exporting as ${format}`);
    setShowExportMenu(false);
    toast.success(`Inventory exported as ${format.toUpperCase()}`);
  };

  const getStockStatus = (stock, minStock) => {
    if (stock <= 0) return { label: 'Out of Stock', color: 'text-red-600', bg: 'bg-red-100' };
    if (stock <= minStock) return { label: 'Low Stock', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { label: 'In Stock', color: 'text-green-600', bg: 'bg-green-100' };
  };

  const categories = ['all', 'Electronics', 'Accessories', 'Furniture'];
  
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredInventory.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);

  // Summary stats
  const totalItems = inventory.reduce((sum, item) => sum + item.stock, 0);
  const lowStockCount = inventory.filter(i => i.stock <= i.minStock && i.stock > 0).length;
  const outOfStockCount = inventory.filter(i => i.stock === 0).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * item.price), 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4 md:space-y-6 px-4 md:px-6 pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Inventory Management</h1>
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          {/* Mobile Filters Toggle */}
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="lg:hidden btn-secondary flex items-center justify-center flex-1 sm:flex-none"
          >
            <FaWarehouse className="mr-2" /> Filters
          </button>
          
          {/* Export Button */}
          <div className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setShowExportMenu(!showExportMenu)}
              className="w-full sm:w-auto bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center"
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

      {/* Filters */}
      <div className={`${showMobileFilters ? 'block' : 'hidden lg:block'} bg-white p-4 rounded-xl border border-gray-200`}>
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search Products
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-xs md:text-sm">Total Items</p>
          <p className="text-xl md:text-2xl font-bold mt-2 text-gray-900">{totalItems}</p>
          <p className="text-xs md:text-sm text-yellow-600 mt-2 font-medium">{inventory.length} products</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-xs md:text-sm">Low Stock</p>
          <p className="text-xl md:text-2xl font-bold mt-2 text-yellow-600">{lowStockCount}</p>
          <p className="text-xs md:text-sm text-yellow-600 mt-2 font-medium">Items below minimum</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-xs md:text-sm">Out of Stock</p>
          <p className="text-xl md:text-2xl font-bold mt-2 text-red-600">{outOfStockCount}</p>
          <p className="text-xs md:text-sm text-yellow-600 mt-2 font-medium">Need reorder</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-500 text-xs md:text-sm">Total Value</p>
          <p className="text-xl md:text-2xl font-bold mt-2 text-gray-900">${totalValue.toLocaleString()}</p>
          <p className="text-xs md:text-sm text-yellow-600 mt-2 font-medium">Inventory worth</p>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 md:p-6">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <FaBoxes className="mr-2 text-yellow-400" />
          Stock Levels
        </h2>
        
        {/* Mobile Card View */}
        <div className="block lg:hidden space-y-3">
          {currentItems.map(item => {
            const status = getStockStatus(item.stock, item.minStock);
            return (
              <div key={item.id} className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">SKU: {item.sku}</p>
                  </div>
                  <span className={`${status.bg} ${status.color} px-2 py-1 rounded-full text-xs font-medium`}>
                    {status.label}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm mt-3">
                  <div>
                    <p className="text-gray-500">Stock</p>
                    <p className="font-medium text-gray-900">{item.stock} {item.unit}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-medium text-gray-900">{item.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Min/Max</p>
                    <p className="font-medium text-gray-900">{item.minStock}/{item.maxStock}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Value</p>
                    <p className="font-medium text-gray-900">${(item.stock * item.price).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setSelectedProduct(item);
                      setStockAction('remove');
                      setShowStockModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    disabled={item.stock === 0}
                  >
                    <FaMinus className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(item);
                      setStockAction('add');
                      setShowStockModal(true);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  >
                    <FaPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Min/Max</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map(item => {
                const status = getStockStatus(item.stock, item.minStock);
                return (
                  <tr key={item.id} className="hover:bg-yellow-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">{item.category}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.sku}</td>
                    <td className="px-6 py-4">
                      <span className="text-sm bg-gray-100 px-2 py-1 rounded-lg text-gray-700">
                        {item.location}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-medium ${item.stock <= item.minStock ? 'text-yellow-600' : 'text-gray-900'}`}>
                        {item.stock} {item.unit}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.minStock}/{item.maxStock}</td>
                    <td className="px-6 py-4">
                      <span className={`${status.bg} ${status.color} px-3 py-1 rounded-full text-xs font-medium`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      ${(item.stock * item.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setStockAction('remove');
                            setShowStockModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          disabled={item.stock === 0}
                        >
                          <FaMinus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setStockAction('add');
                            setShowStockModal(true);
                          }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <FaPlus className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredInventory.length > itemsPerPage && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredInventory.length)} of {filteredInventory.length} products
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

        {filteredInventory.length === 0 && (
          <div className="text-center py-12">
            <FaBoxes className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No products found</p>
          </div>
        )}
      </div>

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl animate-scale-in">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center">
                  <FaBoxes className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h2>
                  <p className="text-sm text-gray-500">SKU: {selectedProduct.sku}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setSelectedProduct(null);
                  setQuantity('');
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Quantity to {stockAction === 'add' ? 'Add' : 'Remove'}
              </label>
              <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                placeholder="Enter quantity"
                min="1"
                autoFocus
              />
              <div className="flex justify-between mt-2">
                <p className="text-xs text-gray-500">Current: {selectedProduct.stock} {selectedProduct.unit}</p>
                <p className="text-xs text-gray-500">Location: {selectedProduct.location}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowStockModal(false);
                  setSelectedProduct(null);
                  setQuantity('');
                }}
                className="flex-1 px-4 py-3 text-sm text-gray-600 hover:text-gray-800 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStockUpdate}
                className="flex-1 px-4 py-3 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition-colors"
              >
                Update Stock
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;