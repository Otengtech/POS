import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminApi } from '../../api/admins';
import { useToast } from '../../contexts/ToastContext';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import ConfirmDialog from '../../common/ConfirmDialog';

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, adminId: null });
  const toast = useToast();

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await adminApi.listAdmins();
      setAdmins(response.data.admins || []);
    } catch (error) {
      toast.error('Failed to fetch admins');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await adminApi.deleteAdmin(deleteDialog.adminId);
      toast.success('Admin deleted successfully');
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete admin');
    } finally {
      setDeleteDialog({ isOpen: false, adminId: null });
    }
  };

  const handleDeactivate = async (id) => {
    try {
      await adminApi.deactivateAdmin(id);
      toast.success('Admin deactivated successfully');
      fetchAdmins();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to deactivate admin');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Admins</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all administrators in the system
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/admins/create"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Admin
          </Link>
        </div>
      </div>
      
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                      Name
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Email
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {admins.map((admin) => (
                    <tr key={admin._id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          {admin.profileImage && (
                            <img 
                              src={admin.profileImage} 
                              alt="" 
                              className="h-10 w-10 rounded-full mr-3"
                            />
                          )}
                          <div className="font-medium text-gray-900">
                            {admin.firstName} {admin.lastName}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {admin.email}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        {admin.role}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          admin.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/admins/${admin._id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          <EyeIcon className="h-5 w-5 inline" />
                        </Link>
                        <Link
                          to={`/admins/${admin._id}/edit`}
                          className="text-yellow-600 hover:text-yellow-900 mr-4"
                        >
                          <PencilIcon className="h-5 w-5 inline" />
                        </Link>
                        {admin.isActive && (
                          <button
                            onClick={() => handleDeactivate(admin._id)}
                            className="text-orange-600 hover:text-orange-900 mr-4"
                          >
                            Deactivate
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteDialog({ isOpen: true, adminId: admin._id })}
                          className="text-red-600 hover:text-red-900"
                        >
                          <TrashIcon className="h-5 w-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, adminId: null })}
        onConfirm={handleDelete}
        title="Delete Admin"
        message="Are you sure you want to delete this admin? This action cannot be undone."
      />
    </div>
  );
};

export default AdminList;