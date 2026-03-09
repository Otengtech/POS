import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminApi } from '../../api/admins';
import { useToast } from '../../contexts/ToastContext';
import AdminForm from '../../page/Forms/AdminForm';
import LoadingSpinner from '../../common/Loader';
import PageHeader from '../../common/PageHeader';

const EditAdmin = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchAdmin();
  }, [id]);

  const fetchAdmin = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getAdmin(id);
      setAdmin(response.data.admin);
    } catch (error) {
      toast.error('Failed to fetch admin details');
      navigate('/admins');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      await adminApi.updateAdmin(id, data);
      toast.success('Admin updated successfully');
      navigate('/admins');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update admin');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!admin) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Admin not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <PageHeader 
        title="Edit Admin"
        subtitle="Update administrator information"
        backLink="/admins"
      />

      <div className="mt-8">
        <AdminForm 
          initialData={admin}
          onSubmit={handleSubmit} 
          loading={submitting}
          onCancel={() => navigate('/admins')}
          isEdit={true}
        />
      </div>
    </div>
  );
};

export default EditAdmin;