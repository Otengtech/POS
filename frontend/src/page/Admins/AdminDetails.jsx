import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { adminApi } from '../../api/admins';
import { useToast } from '../../contexts/ToastContext';
import LoadingSpinner from '../../common/Loader';
import ConfirmDialog from '../../common/ConfirmDialog';
import StatusBadge from '../../common/StatusBadge';
import Card from '../../common/Card';
import PageHeader from '../../common/PageHeader';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  CalendarIcon,
  ShieldCheckIcon,
  PencilIcon,
  TrashIcon,
  ArrowPathIcon,
  CheckBadgeIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

const AdminDetails = () => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false });
  const [deactivateDialog, setDeactivateDialog] = useState({ isOpen: false });
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchAdminDetails();
  }, [id]);

  const fetchAdminDetails = async () => {
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

  const handleDelete = async () => {
    try {
      await adminApi.deleteAdmin(id);
      toast.success('Admin deleted successfully');
      navigate('/admins');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    } finally {
      setDeleteDialog({ isOpen: false });
    }
  };

  const handleDeactivate = async () => {
    try {
      await adminApi.deactivateAdmin(id);
      toast.success('Admin deactivated successfully');
      fetchAdminDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate admin');
    } finally {
      setDeactivateDialog({ isOpen: false });
    }
  };

  const handleActivate = async () => {
    try {
      // Note: You might need to add an activate endpoint
      toast.success('Admin activated successfully');
      fetchAdminDetails();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to activate admin');
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

  const actions = (
    <div className="flex space-x-3">
      <Link
        to={`/admins/${id}/edit`}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <PencilIcon className="h-4 w-4 mr-2" />
        Edit
      </Link>
      
      {admin.isActive ? (
        <button
          onClick={() => setDeactivateDialog({ isOpen: true })}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <XCircleIcon className="h-4 w-4 mr-2" />
          Deactivate
        </button>
      ) : (
        <button
                  onClick={handleActivate}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          <CheckBadgeIcon className="h-4 w-4 mr-2" />
          Activate
        </button>
      )}
      
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
        title="Admin Details"
        subtitle={`Viewing information for ${admin.firstName} ${admin.lastName}`}
        backLink="/admins"
        actions={actions}
      />

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <Card>
            <div className="text-center">
              {admin.profileImage ? (
                <img
                  src={admin.profileImage}
                  alt={`${admin.firstName} ${admin.lastName}`}
                  className="h-32 w-32 rounded-full mx-auto object-cover border-4 border-gray-200"
                />
              ) : (
                <div className="h-32 w-32 rounded-full mx-auto bg-indigo-100 flex items-center justify-center border-4 border-gray-200">
                  <UserIcon className="h-16 w-16 text-indigo-600" />
                </div>
              )}
              
              <h2 className="mt-4 text-xl font-bold text-gray-900">
                {admin.firstName} {admin.lastName}
              </h2>
              
              <div className="mt-2">
                <StatusBadge status={admin.isActive ? 'active' : 'inactive'} />
              </div>
              
              <div className="mt-4 text-sm text-gray-500">
                <div className="flex items-center justify-center">
                  <ShieldCheckIcon className="h-4 w-4 mr-1 text-gray-400" />
                  <span className="capitalize">{admin.role?.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gray-200 pt-6">
              <dl className="space-y-4">
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500 w-24">Status:</dt>
                  <dd>
                    <StatusBadge status={admin.isActive ? 'active' : 'inactive'} type="dot" />
                  </dd>
                </div>
                
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500 w-24">Role:</dt>
                  <dd className="text-sm text-gray-900 capitalize">
                    {admin.role?.replace('_', ' ')}
                  </dd>
                </div>
                
                <div className="flex items-center">
                  <dt className="text-sm font-medium text-gray-500 w-24">Last Login:</dt>
                  <dd className="text-sm text-gray-900">
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString('en-GH') : 'Never'}
                  </dd>
                </div>
              </dl>
            </div>
          </Card>
        </div>

        {/* Details Card */}
        <div className="lg:col-span-2">
          <Card title="Personal Information">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Full name
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {admin.firstName} {admin.lastName}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Email address
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <a href={`mailto:${admin.email}`} className="text-indigo-600 hover:text-indigo-900">
                    {admin.email}
                  </a>
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <PhoneIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Phone number
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {admin.phone || 'Not provided'}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <CalendarIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Created at
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(admin.createdAt).toLocaleString('en-GH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </dd>
              </div>
              
              <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <ArrowPathIcon className="h-4 w-4 mr-2 text-gray-400" />
                  Last updated
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {new Date(admin.updatedAt).toLocaleString('en-GH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </dd>
              </div>
            </dl>
          </Card>

          {/* Activity Card */}
          <Card title="Recent Activity" className="mt-6">
            <div className="text-center py-8">
              <p className="text-sm text-gray-500">No recent activity to display</p>
            </div>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete ${admin.firstName} ${admin.lastName}? This action cannot be undone.`}
        confirmText="Delete"
        type="danger"
      />

      {/* Deactivate Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deactivateDialog.isOpen}
        onClose={() => setDeactivateDialog({ isOpen: false })}
        onConfirm={handleDeactivate}
        title="Deactivate Admin"
        message={`Are you sure you want to deactivate ${admin.firstName} ${admin.lastName}? They will no longer be able to access the system.`}
        confirmText="Deactivate"
        type="warning"
      />
    </div>
  );
};

export default AdminDetails;