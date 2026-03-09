import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { businessApi } from '../../api/businesses';
import { useToast } from '../../contexts/ToastContext';
import BusinessForm from '../../page/Forms/BusinessForm';
import Loader from '../../common/Loader';

const EditBusiness = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchBusiness();
  }, [id]);

  const fetchBusiness = async () => {
    try {
      setLoading(true);
      const response = await businessApi.getBusiness(id);
      setBusiness(response.data.business);
    } catch (error) {
      toast.error('Failed to fetch business details');
      navigate('/businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      await businessApi.updateBusiness(id, data);
      toast.success('Business updated successfully');
      navigate('/businesses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update business');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <Loader fullPage />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Edit Business</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update business information
          </p>
        </div>
      </div>

      <div className="mt-8">
        <BusinessForm 
          initialData={business}
          onSubmit={handleSubmit} 
          loading={submitting}
          onCancel={() => navigate('/businesses')}
        />
      </div>
    </div>
  );
};

export default EditBusiness;