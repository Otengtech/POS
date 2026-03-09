import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { branchApi } from '../../api/branches';
import { useToast } from '../../contexts/ToastContext';
import BranchForm from '../../page/Forms/BranchForm';
import Loader from '../../common/Loader';

const EditBranch = () => {
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchBranch();
  }, [id]);

  const fetchBranch = async () => {
    try {
      setLoading(true);
      const response = await branchApi.getBranch(id);
      setBranch(response.data.branch);
    } catch (error) {
      toast.error('Failed to fetch branch details');
      navigate('/branches');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data) => {
    try {
      setSubmitting(true);
      await branchApi.updateBranch(id, data);
      toast.success('Branch updated successfully');
      navigate('/branches');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update branch');
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
          <h1 className="text-xl font-semibold text-gray-900">Edit Branch</h1>
          <p className="mt-2 text-sm text-gray-700">
            Update branch information
          </p>
        </div>
      </div>

      <div className="mt-8">
        <BranchForm 
          initialData={branch}
          onSubmit={handleSubmit} 
          loading={submitting}
          onCancel={() => navigate('/branches')}
        />
      </div>
    </div>
  );
};

export default EditBranch;