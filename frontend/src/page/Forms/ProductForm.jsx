import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { XCircleIcon, PlusIcon } from '@heroicons/react/24/outline';

const schema = yup.object({
  name: yup.string().required('Product name is required'),
  sku: yup.string().required('SKU is required'),
  barcode: yup.string().nullable(),
  description: yup.string().nullable(),
  price: yup.number().required('Price is required').min(0, 'Price cannot be negative'),
  costPrice: yup.number().min(0, 'Cost price cannot be negative').nullable(),
  categoryId: yup.string().nullable(),
  brand: yup.string().nullable(),
  stock: yup.number().required('Stock is required').min(0, 'Stock cannot be negative'),
  lowStockThreshold: yup.number().min(0).default(10),
  taxRate: yup.number().min(0).max(100).default(0),
  weight: yup.number().min(0).nullable(),
  weightUnit: yup.string().oneOf(['kg', 'g', 'lb', 'oz']).default('kg'),
  dimensions: yup.object({
    length: yup.number().min(0).nullable(),
    width: yup.number().min(0).nullable(),
    height: yup.number().min(0).nullable(),
    unit: yup.string().oneOf(['cm', 'in', 'm']).default('cm')
  }).nullable(),
  status: yup.string().oneOf(['active', 'draft', 'archived']).default('active'),
});

const ProductForm = ({ initialData, onSubmit, loading, categories, onCancel, isEdit = false }) => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(initialData?.images || []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      name: '',
      sku: '',
      barcode: '',
      description: '',
      price: 0,
      costPrice: 0,
      categoryId: '',
      brand: '',
      stock: 0,
      lowStockThreshold: 10,
      taxRate: 0,
      weight: null,
      weightUnit: 'kg',
      dimensions: {
        length: null,
        width: null,
        height: null,
        unit: 'cm'
      },
      status: 'active'
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const onFormSubmit = (data) => {
    const formData = {
      ...data,
      images: images.length > 0 ? images : (initialData?.images || []),
    };
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Basic Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              Product details and identification
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="sku" className="block text-sm font-medium text-gray-700">
                  SKU *
                </label>
                <input
                  type="text"
                  {...register('sku')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.sku && (
                  <p className="mt-1 text-sm text-red-600">{errors.sku.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="barcode" className="block text-sm font-medium text-gray-700">
                  Barcode
                </label>
                <input
                  type="text"
                  {...register('barcode')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  {...register('categoryId')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a category</option>
                  {categories.map(category => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-span-6">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  {...register('description')}
                  rows={3}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Pricing & Inventory</h3>
            <p className="mt-1 text-sm text-gray-500">
              Price, stock, and inventory settings
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price (GH₵) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('price')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="costPrice" className="block text-sm font-medium text-gray-700">
                  Cost Price (GH₵)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('costPrice')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                  Current Stock *
                </label>
                <input
                  type="number"
                  {...register('stock')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label htmlFor="lowStockThreshold" className="block text-sm font-medium text-gray-700">
                  Low Stock Threshold
                </label>
                <input
                  type="number"
                  {...register('lowStockThreshold')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-2">
                <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  step="0.1"
                  {...register('taxRate')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Physical Attributes</h3>
            <p className="mt-1 text-sm text-gray-500">
              Weight, dimensions, and brand
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="brand" className="block text-sm font-medium text-gray-700">
                  Brand
                </label>
                <input
                  type="text"
                  {...register('brand')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">
                  Weight
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.01"
                    {...register('weight')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <select
                    {...register('weightUnit')}
                    className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="kg">kg</option>
                    <option value="g">g</option>
                    <option value="lb">lb</option>
                    <option value="oz">oz</option>
                  </select>
                </div>
              </div>

              <div className="col-span-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (L x W x H)
                </label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    {...register('dimensions.length')}
                    placeholder="Length"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <input
                    type="number"
                    step="0.1"
                    {...register('dimensions.width')}
                    placeholder="Width"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <input
                    type="number"
                    step="0.1"
                    {...register('dimensions.height')}
                    placeholder="Height"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  <select
                    {...register('dimensions.unit')}
                    className="mt-1 block w-24 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                    <option value="m">m</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Product Images</h3>
            <p className="mt-1 text-sm text-gray-500">
              Upload product photos
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-4 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative">
                  <img
                    src={preview}
                    alt={`Product ${index + 1}`}
                    className="h-24 w-24 object-cover rounded-lg border border-gray-200"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-2 -right-2 bg-red-100 rounded-full p-1 text-red-600 hover:bg-red-200"
                  >
                    <XCircleIcon className="h-5 w-5" />
                  </button>
                </div>
              ))}
              
              <label className="h-24 w-24 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500">
                <PlusIcon className="h-8 w-8 text-gray-400" />
                <span className="text-xs text-gray-500">Add Image</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="sr-only"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Status</h3>
            <p className="mt-1 text-sm text-gray-500">
              Product visibility and status
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <select
              {...register('status')}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="active">Active</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;