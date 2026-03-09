import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { productApi } from '../../api/products';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../common/Loader';
import ConfirmDialog from '../../common/ConfirmDialog';
import StatusBadge from '../../common/StatusBadge';
import Card from '../../common/Card';
import PageHeader from '../../common/PageHeader';
import { 
  ShoppingBagIcon, 
  TagIcon, 
  CurrencyDollarIcon,
  CubeIcon,
  DocumentTextIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  QrCodeIcon,
} from '@heroicons/react/24/outline';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false });
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await productApi.getProduct(id);
      setProduct(response.data.product);
    } catch (error) {
      toast.error('Failed to fetch product details');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await productApi.deleteProduct(id);
      toast.success('Product deleted successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete product');
    } finally {
      setDeleteDialog({ isOpen: false });
    }
  };

  const handleStockAdjust = async () => {
    // Navigate to stock adjustment page or open modal
    navigate(`/products/${id}/adjust-stock`);
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

  const isLowStock = product.stock <= (product.lowStockThreshold || 10);
  const isOutOfStock = product.stock <= 0;

  const actions = (
    <div className="flex space-x-3">
      <button
        onClick={handleStockAdjust}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <ArrowPathIcon className="h-4 w-4 mr-2" />
        Adjust Stock
      </button>
      <Link
        to={`/products/${id}/edit`}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PencilIcon className="h-4 w-4 mr-2" />
        Edit
      </Link>
      <button
        onClick={() => setDeleteDialog({ isOpen: true })}
        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
      >
        <TrashIcon className="h-4 w-4 mr-2" />
        Delete
      </button>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Product Details"
        subtitle={`Viewing information for ${product.name}`}
        backLink="/products"
        actions={actions}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Product Image Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              {product.images && product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-48 w-48 object-cover rounded-lg mx-auto border-2 border-gray-200"
                />
              ) : (
                <div className="h-48 w-48 rounded-lg mx-auto bg-gray-100 flex items-center justify-center border-2 border-gray-200">
                  <ShoppingBagIcon className="h-24 w-24 text-gray-400" />
                </div>
              )}
              
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {product.name}
              </h2>
              
              <div className="mt-2">
                <StatusBadge status={product.status || 'active'} />
                {isLowStock && !isOutOfStock && (
                  <span className="ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-yellow-100 text-yellow-800">
                    Low Stock
                  </span>
                )}
                {isOutOfStock && (
                  <span className="ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-red-100 text-red-800">
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <dl className="space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">SKU:</dt>
                  <dd className="text-sm text-gray-900 font-mono">{product.sku}</dd>
                </div>
                
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Barcode:</dt>
                  <dd className="text-sm text-gray-900 font-mono">{product.barcode || 'N/A'}</dd>
                </div>
                
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Category:</dt>
                  <dd className="text-sm text-gray-900">{product.categoryId?.name || 'Uncategorized'}</dd>
                </div>
                
                <div className="flex items-center justify-between">
                  <dt className="text-sm font-medium text-gray-500">Brand:</dt>
                  <dd className="text-sm text-gray-900">{product.brand || 'N/A'}</dd>
                </div>
              </dl>
            </div>
          </Card>
        </div>

        {/* Product Details Card */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Pricing & Inventory">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Price
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="font-semibold text-lg">GH₵ {product.price?.toFixed(2)}</span>
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Cost Price
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  GH₵ {product.costPrice?.toFixed(2) || '0.00'}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CubeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Stock Level
                </dt>
                <dd className="mt-1 text-sm sm:mt-0 sm:col-span-2">
                  <div className="flex items-center">
                    <span className={`font-semibold ${
                      isOutOfStock ? 'text-red-600' : 
                      isLowStock ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {product.stock} units
                    </span>
                    <span className="ml-2 text-gray-500">
                      (Threshold: {product.lowStockThreshold || 10})
                    </span>
                  </div>
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <TagIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Tax Rate
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {product.taxRate || 0}%
                </dd>
              </div>
            </dl>
          </Card>

          <Card title="Product Information">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <DocumentTextIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Description
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {product.description || 'No description provided'}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Weight</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {product.weight ? `${product.weight} ${product.weightUnit || 'kg'}` : 'N/A'}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Dimensions</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {product.dimensions ? 
                    `${product.dimensions.length} x ${product.dimensions.width} x ${product.dimensions.height} ${product.dimensions.unit || 'cm'}` : 
                    'N/A'}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Created</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(product.createdAt).toLocaleString('en-GH')}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(product.updatedAt).toLocaleString('en-GH')}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Product Images Gallery */}
          {product.images && product.images.length > 1 && (
            <Card title="Additional Images">
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(1).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="h-20 w-20 object-cover rounded-lg border border-gray-200"
                  />
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Product"
        message={`Are you sure you want to delete ${product.name}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />
    </div>
  );
};

export default ProductDetails;