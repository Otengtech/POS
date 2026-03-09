import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { productApi } from '../../api/products';
import { categoryApi } from '../../api/categories';
import { useToast } from '../../contexts/ToastContext';
import ProductForm from '../../page/Forms/ProductForm';
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/Loader';

const EditProduct = () => {
  const [product, setProduct] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    Promise.all([fetchProduct(), fetchCategories()]);
  }, [id]);

  const fetchProduct = async () => {
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

  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      const response = await categoryApi.listCategories({ limit: 100 });
      setCategories(response.data.categories || []);
    } catch (error) {
      toast.error('Failed to fetch categories');
    } finally {
      setLoadingCategories(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      await productApi.updateProduct(id, data);
      toast.success('Product updated successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update product');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || loadingCategories) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Product not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Edit Product"
        subtitle={`Update information for ${product.name}`}
        backLink="/products"
      />

      <div className="mt-8">
        <ProductForm 
          initialData={product}
          onSubmit={handleSubmit} 
          loading={submitting}
          categories={categories}
          onCancel={() => navigate('/products')}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditProduct;