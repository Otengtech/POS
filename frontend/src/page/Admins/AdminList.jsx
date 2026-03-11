import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admins';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { 
  PencilIcon, 
  TrashIcon, 
  EyeIcon,
  UserPlusIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowPathIcon,
  ShieldCheckIcon,
  UserCircleIcon,
  EnvelopeIcon,
  CalendarIcon,
  ClockIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import ConfirmDialog from '../../common/ConfirmDialog';
import Loader from '../../common/Loader';

const AdminList = () => {
  const { user } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [filteredAdmins, setFilteredAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, adminId: null, adminName: '' });
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const toast = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  useEffect(() => {
    filterAdmins();
  }, [admins, searchTerm, statusFilter]);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApi.listAdmins();
      console.log('Admins response:', response);
      
      if (response?.data && Array.isArray(response.data)) {
        setAdmins(response.data);
        setLastUpdated(new Date());
      } else {
        console.error('Unexpected response structure:', response);
        setError('Unexpected data format received from server');
        toast.error('Unexpected data format received');
      }
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      setError(error.response?.data?.message || 'Failed to fetch admins');
      toast.error(error.response?.data?.message || 'Failed to fetch admins');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAdmins();
    setRefreshing(false);
    toast.success('Admin list refreshed');
  };

  const filterAdmins = () => {
    let filtered = [...admins];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(admin => 
        admin.firstName?.toLowerCase().includes(term) ||
        admin.lastName?.toLowerCase().includes(term) ||
        admin.email?.toLowerCase().includes(term) ||
        admin.role?.toLowerCase().includes(term)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(admin => 
        statusFilter === 'active' ? admin.isActive : !admin.isActive
      );
    }

    setFilteredAdmins(filtered);
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteAdmin(deleteDialog.adminId);
      toast.success('Admin deleted successfully');
      fetchAdmins();
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    } finally {
      setDeleteDialog({ isOpen: false, adminId: null, adminName: '' });
    }
  };

  const handleDeactivate = async (id, currentStatus) => {
    try {
      if (currentStatus) {
        await adminApi.deactivateAdmin(id);
        toast.success('Admin deactivated successfully');
      } else {
        await adminApi.activateAdmin(id);
        toast.success('Admin activated successfully');
      }
      fetchAdmins();
    } catch (error) {
      console.error('Status change error:', error);
      toast.error(error.response?.data?.message || `Failed to ${currentStatus ? 'deactivate' : 'activate'} admin`);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'super_admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'admin':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="h-8 w-64 bg-gradient-to-r from-[#E5ECE8] to-[#F0F5F2] rounded-lg animate-pulse"></div>
          <div className="h-4 w-96 bg-gradient-to-r from-[#E5ECE8] to-[#F0F5F2] rounded-lg animate-pulse"></div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-[#AFC1B3]/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-[#E5ECE8] to-[#F0F5F2] rounded-xl animate-pulse"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gradient-to-r from-[#E5ECE8] to-[#F0F5F2] rounded w-24 animate-pulse"></div>
                    <div className="h-6 bg-gradient-to-r from-[#E5ECE8] to-[#F0F5F2] rounded w-16 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-gradient-to-br from-red-50 to-red-100/50 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-red-100">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] rounded-xl flex items-center justify-center shadow-lg">
                <ExclamationCircleIcon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Unable to load admins</h3>
              <p className="text-gray-900 text-sm mb-4">{error}</p>
              <button
                onClick={fetchAdmins}
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-[#8FA5A0] to-[#AFC1B3] text-white text-sm font-medium rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-light text-gray-900 mb-2 flex items-center">
              <ShieldCheckIcon className="h-8 w-8 text-gray-900 mr-3" />
              Administrators
            </h1>
            <p className="text-sm text-gray-900 flex items-center">
              <span className="w-1.5 h-1.5 bg-[#AFC1B3] rounded-full mr-2"></span>
              Manage system administrators and their permissions • Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="group flex items-center px-4 py-2 bg-black backdrop-blur-sm rounded-full text-sm font-medium text-white transition-all duration-200 shadow-sm disabled:opacity-50"
            >
              <ArrowPathIcon className={`h-4 w-4 mr-2 group-hover:rotate-180 transition-transform duration-500 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <Link
              to="/admins/create"
              className="inline-flex items-center px-4 py-2 bg-[#8FA5A0] text-white text-sm font-medium rounded-full hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add Admin
            </Link>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-900 z-10" />
          </div>
          <input
            type="text"
            placeholder="Search by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 placeholder:text-gray-900 pr-3 py-3 border border-[#AFC1B3]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#AFC1B3] focus:border-transparent transition-all duration-200 bg-white/80"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FunnelIcon className="h-5 w-5 text-gray-900 z-10" />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-[#AFC1B3]/30 rounded-full focus:outline-none focus:ring-2 focus:ring-[#AFC1B3] focus:border-transparent transition-all duration-200 appearance-none bg-white/80 backdrop-blur-sm"
          >
            <option value="all">All Status</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-end">
          <span className=" px-4 py-3 rounded-xl text-sm text-gray-900">
            Showing <span className="font-semibold text-gray-900">{filteredAdmins.length}</span> of <span className="font-semibold text-gray-900">{admins.length}</span> admins
          </span>
        </div>
      </div>

      {/* Admins Grid */}
      {filteredAdmins.length === 0 ? (
        <div className="text-center py-16 bg-white/60 backdrop-blur-sm rounded-2xl border border-[#AFC1B3]/20">
          <UserCircleIcon className="h-20 w-20 text-[#AFC1B3] mx-auto mb-4" />
          <h3 className="text-xl font-light text-gray-900 mb-2">No admins found</h3>
          <p className="text-gray-900 mb-8">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search filters' 
              : 'Get started by adding your first administrator'}
          </p>
          {(searchTerm || statusFilter !== 'all') ? (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#8FA5A0] to-[#AFC1B3] text-white rounded-xl hover:shadow-lg transition-all duration-200"
            >
              Clear Filters
            </button>
          ) : (
            <Link
              to="/admins/create"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#8FA5A0] to-[#AFC1B3] text-white rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              <UserPlusIcon className="h-5 w-5 mr-2" />
              Add Admin
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
  {filteredAdmins.map((admin) => (
    <div
      key={admin._id}
      className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border border-gray-100"
    >
      
      <div className="p-6">
        {/* Header with Avatar */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="relative">
              {admin.profileImage ? (
                <img
                  src={admin.profileImage}
                  alt={`${admin.firstName} ${admin.lastName}`}
                  className="h-16 w-16 rounded-xl object-cover ring-2 ring-white shadow-md"
                />
              ) : (
                <div className="h-16 w-16 rounded-xl bg-black flex items-center justify-center shadow-md">
                  <span className="text-2xl font-light text-white">
                    {admin.firstName?.[0]}{admin.lastName?.[0]}
                  </span>
                </div>
              )}
              <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full border-2 border-white shadow ${
                admin.isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}></div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-black">
                {admin.firstName} {admin.lastName}
              </h3>
              <p className="text-sm text-gray-900 flex items-center mt-1">
                <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {admin.email}
              </p>
            </div>
          </div>
        </div>

        {/* Role Badge */}
        <div className="mb-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            admin.role === 'super_admin' 
              ? 'bg-black text-white' 
              : 'bg-[#8FA5A0] text-white'
          }`}>
            <svg className="h-3 w-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            {admin.role?.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </span>
        </div>

        {/* Additional Info */}
        <div className="space-y-2 text-sm text-gray-900 mb-4">
          {admin.lastLoginAt && (
            <div className="flex items-center">
              <svg className="h-4 w-4 mr-2 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Last login: {formatDate(admin.lastLoginAt)}</span>
            </div>
          )}
          <div className="flex items-center">
            <svg className="h-4 w-4 mr-2 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Joined: {formatDate(admin.createdAt)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex space-x-1">
            <Link
              to={`/admins/${admin._id}`}
              className="p-2 text-gray-900 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="View Details"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </Link>
            {/* <Link
              to={`/admins/${admin._id}/edit`}
              className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-all duration-200"
              title="Edit Admin"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </Link> */}
            <button
              onClick={() => handleToggleStatus(admin._id, admin.isActive)}
              className={`p-2 rounded-lg transition-all duration-200 ${
                admin.isActive 
                  ? 'text-orange-500 hover:text-orange-600 hover:bg-orange-50' 
                  : 'text-green-500 hover:text-green-600 hover:bg-green-50'
              }`}
              title={admin.isActive ? 'Deactivate' : 'Activate'}
            >
              {admin.isActive ? (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
              ) : (
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          </div>
          
          {/* Delete button - only for super_admin and not self */}
          {(user?.role === 'super_admin' && user?.id !== admin._id) && (
            <button
              onClick={() => setDeleteDialog({ 
                isOpen: true, 
                adminId: admin._id,
                adminName: `${admin.firstName} ${admin.lastName}`
              })}
              className="p-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              title="Delete Admin"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  ))}
</div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, adminId: null, adminName: '' })}
        onConfirm={handleDelete}
        title="Delete Admin"
        message={`Are you sure you want to delete ${deleteDialog.adminName}? This action cannot be undone and will permanently remove all associated data.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      {/* Footer note */}
      {filteredAdmins.length > 0 && (
        <div className="mt-6 text-center">
          <p className="text-xs text-[#AFC1B3]">
            {filteredAdmins.length} administrator{filteredAdmins.length !== 1 ? 's' : ''} • Manage access and permissions
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminList;