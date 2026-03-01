import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaWarehouse, FaExclamationTriangle, FaHistory } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Inventory = () => {
  const { userRole } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showStockModal, setShowStockModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [stockAction, setStockAction] = useState('add'); // 'add' or 'remove'
  const [quantity, setQuantity] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setInventory([
        { id: 1, name: 'Laptop', sku: 'LAP001', currentStock: 15, minStock: 5, maxStock: 50, unit: 'pcs', location: 'A1', lastUpdated: '2024-01-15' },
        { id: 2, name: 'Mouse', sku: 'MOU001', currentStock: 50, minStock: 10, maxStock: 100, unit: 'pcs', location: 'A2', lastUpdated: '2024-01-15' },
        { id: 3, name: 'Keyboard', sku: 'KEY001', currentStock: 30, minStock: 8, maxStock: 80, unit: 'pcs', location: 'A3', lastUpdated: '2024-01-14' },
        { id: 4, name: 'Monitor', sku: 'MON001', currentStock: 8, minStock: 5, maxStock: 30, unit: 'pcs', location: 'B1', lastUpdated: '2024-01-13' },
        { id: 5, name: 'Desk Chair', sku: 'CHR001', currentStock: 5, minStock: 3, maxStock: 20, unit: 'pcs', location: 'C1', lastUpdated: '2024-01-12' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleStockUpdate = () => {
    if (!quantity || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    // API call here
    toast.success(`Stock ${stockAction === 'add' ? 'added' : 'removed'} successfully`);
    setShowStockModal(false);
    setQuantity('');
    setSelectedProduct(null);
  };

  const getStockStatus = (current, min) => {
    if (current <= 0) return { color: 'text-red-600', bg: 'bg-red-100', text: 'Out of Stock' };
    if (current <= min) return { color: 'text-orange-600', bg: 'bg-orange-100', text: 'Low Stock' };
    return { color: 'text-green-600', bg: 'bg-green-100', text: 'In Stock' };
  };

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Management</h1>
        <button
          onClick={() => setShowHistory(true)}
          className="btn-secondary flex items-center"
        >
          <FaHistory className="mr-2" /> Stock History
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-2xl font-bold mt-2">{inventory.length}</p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Low Stock Items</p>
          <p className="text-2xl font-bold mt-2 text-orange-600">
            {inventory.filter(i => i.currentStock <= i.minStock).length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Out of Stock</p>
          <p className="text-2xl font-bold mt-2 text-red-600">
            {inventory.filter(i => i.currentStock === 0).length}
          </p>
        </div>
        <div className="card">
          <p className="text-gray-500 text-sm">Total Value</p>
          <p className="text-2xl font-bold mt-2">$45,678</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm">
        <div className="relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search inventory..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field pl-10"
          />
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Max Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Updated</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredInventory.map(item => {
                const status = getStockStatus(item.currentStock, item.minStock);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{item.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.sku}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.location}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{item.currentStock} {item.unit}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.minStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.maxStock}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`${status.bg} ${status.color} px-2 py-1 rounded-full text-xs font-semibold`}>
                        {status.text}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{item.lastUpdated}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setStockAction('add');
                            setShowStockModal(true);
                          }}
                          className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Add Stock"
                        >
                          <FaPlus />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProduct(item);
                            setStockAction('remove');
                            setShowStockModal(true);
                          }}
                          className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                          title="Remove Stock"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stock Update Modal */}
      {showStockModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">
                {stockAction === 'add' ? 'Add Stock' : 'Remove Stock'}
              </h2>
              <p className="text-gray-600 mb-4">Product: {selectedProduct.name}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Stock: {selectedProduct.currentStock} {selectedProduct.unit}
                  </label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="input-field"
                    placeholder={`Enter quantity to ${stockAction}`}
                    min="1"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason (Optional)
                  </label>
                  <textarea
                    className="input-field"
                    rows="3"
                    placeholder="Enter reason for stock adjustment"
                  ></textarea>
                </div>

                <div className="flex space-x-3 mt-6">
                  <button
                    onClick={() => {
                      setShowStockModal(false);
                      setSelectedProduct(null);
                      setQuantity('');
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStockUpdate}
                    className="btn-primary flex-1"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stock History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Stock Movement History</h2>
                <button
                  onClick={() => setShowHistory(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div key={item} className="border-l-4 border-yellow-400 bg-gray-50 p-4 rounded-r-lg">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-semibold">Laptop - SKU: LAP001</p>
                        <p className="text-sm text-gray-600">Added 50 units</p>
                      </div>
                      <span className="text-sm text-gray-500">2024-01-15 10:30 AM</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Reason: Restock from supplier</p>
                    <p className="text-xs text-gray-500 mt-1">By: John Doe</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;