import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/admins';
import { useToast } from '../../contexts/ToastContext';
import AdminForm from '../../page/Forms/AdminForm';

const CreateAdmin = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await adminApi.createAdmin(data);
      toast.success('Admin created successfully');
      navigate('/admins');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create admin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Create New Admin</h1>
          <p className="mt-2 text-sm text-gray-700">
            Add a new administrator to the system
          </p>
        </div>
      </div>

      <div className="mt-8">
        <AdminForm 
          onSubmit={handleSubmit} 
          loading={loading}
          onCancel={() => navigate('/admins')}
        />
      </div>
    </div>
  );
};

export default CreateAdmin;