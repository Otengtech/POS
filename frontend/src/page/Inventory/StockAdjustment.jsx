import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { inventoryApi } from '../../api/inventory';
import { productApi } from '../../api/products';
import { useToast } from '../../contexts/ToastContext';
import PageHeader from '../../common/PageHeader';
import Card from '../../common/Card';
import LoadingSpinner from '../../common/Loader';
import {
  CubeIcon,
  ArrowPathIcon,
  PlusIcon,
  MinusIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';

const StockAdjustment = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    adjustmentType: 'addition',
    quantity: 1,
    reason: '',
    notes: ''
  });
  
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProduct(id);
      setProduct(response.data.product);
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/inventory');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.quantity <= 0) {
      toast.error('Quantity must be greater than 0');
      return;
    }

    if (!formData.reason) {
      toast.error('Please provide a reason for adjustment');
      return;
    }

    try {
      setSubmitting(true);
      
      const adjustment = formData.adjustmentType === 'addition' 
        ? formData.quantity 
        : -formData.quantity;

      await inventoryApi.adjustStock({
        productId: id,
        adjustment,
        reason: formData.reason,
        notes: formData.notes,
        type: formData.adjustmentType
      });

      toast.success('Stock adjusted successfully');
      navigate(`/products/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to adjust stock');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateNewStock = () => {
    if (!product) return 0;
    const adjustment = formData.adjustmentType === 'addition' 
      ? formData.quantity 
      : -formData.quantity;
    return product.stock + adjustment;
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  const newStock = calculateNewStock();
  const isLowStock = newStock <= (product.lowStockThreshold || 10);
  const isOutOfStock = newStock <= 0;

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Adjust Stock"
        subtitle={`Update inventory for ${product.name}`}
        backLink={`/products/${id}`}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product Info Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              {product.images && product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-32 w-32 object-cover rounded-lg mx-auto border-2 border-gray-200"
                />
              ) : (
                <div className="h-32 w-32 rounded-lg mx-auto bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <CubeIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
              
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {product.name}
              </h2>
              
              <div className="mt-2 text-sm text-gray-500">
                SKU: {product.sku}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <dl className="space-y-3">
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Current Stock:</dt>
                  <dd className="text-sm font-semibold text-gray-900">{product.stock} units</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Price:</dt>
                  <dd className="text-sm font-semibold text-gray-900">GH₵ {product.price}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-sm font-medium text-gray-500">Low Stock Threshold:</dt>
                  <dd className="text-sm font-semibold text-gray-900">{product.lowStockThreshold || 10}</dd>
                </div>
              </dl>
            </div>
          </Card>
        </div>

        {/* Adjustment Form */}
        <div className="lg:col-span-2">
          <Card title="Stock Adjustment">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Adjustment Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Adjustment Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, adjustmentType: 'addition' }))}
                    className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg ${
                      formData.adjustmentType === 'addition'
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <PlusIcon className="h-5 w-5 mr-2" />
                    Addition
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, adjustmentType: 'reduction' }))}
                    className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg ${
                      formData.adjustmentType === 'reduction'
                        ? 'border-red-500 bg-red-50 text-red-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <MinusIcon className="h-5 w-5 mr-2" />
                    Reduction
                  </button>
                </div>
              </div>

              {/* Quantity */}
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Reason */}
              <div>
                <label htmlFor="reason" className="block text-sm font-medium text-gray-700">
                  Reason for Adjustment *
                </label>
                <select
                  name="reason"
                  id="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select a reason</option>
                  <option value="purchase_order">Purchase Order Received</option>
                  <option value="return">Customer Return</option>
                  <option value="damage">Damaged/Expired</option>
                  <option value="count_adjustment">Inventory Count Adjustment</option>
                  <option value="transfer">Stock Transfer</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                  Additional Notes
                </label>
                <textarea
                  name="notes"
                  id="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional details about this adjustment"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                  <DocumentTextIcon className="h-5 w-5 mr-2 text-gray-500" />
                  Adjustment Preview
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Stock:</span>
                    <span className="font-medium">{product.stock} units</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Adjustment:</span>
                    <span className={`font-medium ${
                      formData.adjustmentType === 'addition' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {formData.adjustmentType === 'addition' ? '+' : '-'}{formData.quantity} units
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex justify-between text-base font-bold">
                    <span className="text-gray-900">New Stock:</span>
                    <span className={`${
                      isOutOfStock ? 'text-red-600' : isLowStock ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {newStock} units
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => navigate(`/products/${id}`)}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span className="ml-2">Processing...</span>
                    </>
                  ) : (
                    <>
                      <ArrowPathIcon className="h-4 w-4 mr-2" />
                      Adjust Stock
                    </>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustment;