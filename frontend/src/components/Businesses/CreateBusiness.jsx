import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { businessApi } from '../../api/businesses';
import { useToast } from '../../contexts/ToastContext';
import BusinessForm from '../../page/Forms/BusinessForm';

const CreateBusiness = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await businessApi.createBusiness(data);
      toast.success('Business created successfully');
      navigate('/businesses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create business');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Create New Business</h1>
          <p className="mt-2 text-sm text-gray-700">
            Add a new business to the system
          </p>
        </div>
      </div>

      <div className="mt-8">
        <BusinessForm 
          onSubmit={handleSubmit} 
          loading={loading}
          onCancel={() => navigate('/businesses')}
        />
      </div>
    </div>
  );
};

export default CreateBusiness;