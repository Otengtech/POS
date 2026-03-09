import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { branchApi } from '../../api/branches';
import { useToast } from '../../contexts/ToastContext';
import BranchForm from '../../page/Forms/BranchForm';

const CreateBranch = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  
  // Get businessId from query params if provided
  const queryParams = new URLSearchParams(location.search);
  const initialBusinessId = queryParams.get('businessId');

  const handleSubmit = async (data) => {
    try {
      setLoading(true);
      await branchApi.createBranch(data);
      toast.success('Branch created successfully');
      navigate('/branches');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create branch');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Create New Branch</h1>
          <p className="mt-2 text-sm text-gray-700">
            Add a new branch to the system
          </p>
        </div>
      </div>

      <div className="mt-8">
        <BranchForm 
          initialData={initialBusinessId ? { businessId: initialBusinessId } : undefined}
          onSubmit={handleSubmit} 
          loading={loading}
          onCancel={() => navigate('/branches')}
        />
      </div>
    </div>
  );
};

export default CreateBranch;