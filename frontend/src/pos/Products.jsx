import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaBox, FaTag, FaDollarSign, FaWarehouse, FaTimes } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Products = () => {
  const { userRole } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
  });

  // Mock data - replace with API calls
  useEffect(() => {
    setTimeout(() => {
      setProducts([
        { id: 1, name: 'Laptop', sku: 'LAP001', price: 999.99, cost: 700, stock: 15, category: 'Electronics', unit: 'pcs', image: null },
        { id: 2, name: 'Mouse', sku: 'MOU001', price: 29.99, cost: 15, stock: 50, category: 'Electronics', unit: 'pcs', image: null },
        { id: 3, name: 'Keyboard', sku: 'KEY001', price: 89.99, cost: 45, stock: 30, category: 'Electronics', unit: 'pcs', image: null },
        { id: 4, name: 'Monitor', sku: 'MON001', price: 299.99, cost: 200, stock: 8, category: 'Electronics', unit: 'pcs', image: null },
        { id: 5, name: 'Desk Chair', sku: 'CHR001', price: 199.99, cost: 120, stock: 5, category: 'Furniture', unit: 'pcs', image: null },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    cost: '',
    stock: '',
    category: '',
    unit: 'pcs',
    description: '',
    image: null,
  });

  const canEdit = ['super_admin', 'owner', 'manager', 'inventory'].includes(userRole);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call here
      toast.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        // API call here
        setProducts(products.filter(p => p.id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      sku: '',
      price: '',
      cost: '',
      stock: '',
      category: '',
      unit: 'pcs',
      description: '',
      image: null,
    });
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !filters.category || product.category === filters.category;
    const matchesPrice = (!filters.minPrice || product.price >= Number(filters.minPrice)) &&
                        (!filters.maxPrice || product.price <= Number(filters.maxPrice));
    return matchesSearch && matchesCategory && matchesPrice;
  });

  const categories = [...new Set(products.map(p => p.category))];

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-black">
              Products
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage your inventory
            </p>
          </div>
          {canEdit && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaPlus className="mr-2 text-xs" />
              Add Product
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center justify-center px-4 py-2 text-sm border rounded-lg transition-colors ${
              showFilters 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
            }`}
          >
            <FaFilter className="mr-2 text-xs" />
            Filters
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
                >
                  <option value="">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Min Price ($)
                </label>
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Max Price ($)
                </label>
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                  placeholder="1000"
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                />
              </div>
            </div>
            {(filters.category || filters.minPrice || filters.maxPrice) && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => setFilters({ category: '', minPrice: '', maxPrice: '' })}
                  className="text-xs text-gray-500 hover:text-black transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <FaBox className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No products found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map(product => (
            <div key={product.id} className="group border border-gray-200 rounded-lg hover:border-black transition-colors bg-white">
              {/* Image Placeholder */}
              <div className="aspect-square bg-gray-100 rounded-t-lg flex items-center justify-center border-b border-gray-200">
                <FaBox className="text-3xl text-gray-400" />
              </div>
              
              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-medium text-black text-sm">{product.name}</h3>
                    <p className="text-xs text-gray-400 mt-0.5">SKU: {product.sku}</p>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                    {product.category}
                  </span>
                </div>
                
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    <FaDollarSign className="text-xs text-gray-400" />
                    <span className="text-sm font-medium text-black">${product.price}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaWarehouse className="text-xs text-gray-400" />
                    <span className={`text-xs ${product.stock <= 5 ? 'text-black font-medium' : 'text-gray-600'}`}>
                      {product.stock} in stock
                    </span>
                  </div>
                </div>
                
                {/* Low Stock Indicator */}
                {product.stock <= 5 && (
                  <div className="mb-3">
                    <span className="text-xs text-black bg-gray-100 px-2 py-1 rounded">
                      Low stock
                    </span>
                  </div>
                )}
                
                {/* Actions */}
                {canEdit && (
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                    <button
                      onClick={() => {
                        setEditingProduct(product);
                        setFormData(product);
                        setShowModal(true);
                      }}
                      className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
                      title="Edit"
                    >
                      <FaEdit className="text-sm" />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="p-1.5 text-gray-500 hover:text-black hover:bg-gray-100 rounded transition-colors"
                      title="Delete"
                    >
                      <FaTrash className="text-sm" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-black">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-1 text-gray-400 hover:text-black transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      SKU *
                    </label>
                    <input
                      type="text"
                      name="sku"
                      value={formData.sku}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Cost ($) *
                    </label>
                    <input
                      type="number"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Clothing">Clothing</option>
                    <option value="Food">Food</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none resize-none"
                    placeholder="Optional product description..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {editingProduct ? 'Update' : 'Save'} Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-xs text-gray-400">
        Showing {filteredProducts.length} of {products.length} products
      </div>
    </div>
  );
};

export default Products;