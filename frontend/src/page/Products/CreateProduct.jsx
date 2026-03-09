import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { productApi } from '../../api/products';
import { categoryApi } from '../../api/categories';
import { useToast } from '../../contexts/ToastContext';
import ProductForm from '../../page/Forms/ProductForm';
import PageHeader from '../../common/PageHeader';
import LoadingSpinner from '../../common/Loader';

const CreateProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

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
      setLoading(true);
      await productApi.createProduct(data);
      toast.success('Product created successfully');
      navigate('/products');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  if (loadingCategories) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Create New Product"
        subtitle="Add a new product to inventory"
        backLink="/products"
      />

      <div className="mt-8">
        <ProductForm 
          onSubmit={handleSubmit} 
          loading={loading}
          categories={categories}
          onCancel={() => navigate('/products')}
          isEdit={false}
        />
      </div>
    </div>
  );
};

export default CreateProduct;