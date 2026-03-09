import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import LoadingSpinner from '../common/LoadingSpinner';
import Toast from '../common/Toast';
import ConfirmDialog from '../common/ConfirmDialog';

const Users = () => {
  const { adminApi, userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: '' });
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    userId: null,
    action: null
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.listAdmins();
      setUsers(response.data.data || []);
    } catch (error) {
      setToast({
        show: true,
        message: 'Failed to fetch users',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivate = async (userId) => {
    setConfirmDialog({
      show: true,
      userId,
      action: 'deactivate'
    });
  };

  const handleDelete = async (userId) => {
    setConfirmDialog({
      show: true,
      userId,
      action: 'delete'
    });
  };

  const confirmAction = async () => {
    const { userId, action } = confirmDialog;
    setConfirmDialog({ show: false, userId: null, action: null });

    try {
      if (action === 'deactivate') {
        await adminApi.deactivateAdmin(userId);
        setToast({
          show: true,
          message: 'User deactivated successfully',
          type: 'success'
        });
      } else if (action === 'delete') {
        await adminApi.deleteAdmin(userId);
        setToast({
          show: true,
          message: 'User deleted successfully',
          type: 'success'
        });
      }
      fetchUsers(); // Refresh list
    } catch (error) {
      setToast({
        show: true,
        message: `Failed to ${action} user`,
        type: 'error'
      });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading users..." />;
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-xl font-semibold text-gray-900">Users</h1>
          <p className="mt-2 text-sm text-gray-700">
            List of all users in the system with their roles and status
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          {userRole === 'super_admin' && (
            <>
              <Link
                to="/users/create-owner"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto mr-2"
              >
                Add Owner
              </Link>
              <Link
                to="/users/create-staff"
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
              >
                Add Staff
              </Link>
            </>
          )}
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
                      User
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Role
                    </th>
                    <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                      Contact
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
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            {user.profileImage ? (
                              <img
                                className="h-10 w-10 rounded-full"
                                src={user.profileImage}
                                alt=""
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 font-medium">
                                  {user.firstName?.[0]}{user.lastName?.[0]}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          user.role === 'super_admin' ? 'bg-purple-100 text-purple-800' :
                          user.role === 'owner' ? 'bg-blue-100 text-blue-800' :
                          user.role === 'manager' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <div>{user.phoneNumber}</div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                        <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <Link
                          to={`/users/${user.id}`}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          View
                        </Link>
                        {userRole === 'super_admin' && user.role !== 'super_admin' && (
                          <>
                            <button
                              onClick={() => handleDeactivate(user.id)}
                              className="text-yellow-600 hover:text-yellow-900 mr-4"
                            >
                              {user.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}

      {/* Confirm Dialog */}
      {confirmDialog.show && (
        <ConfirmDialog
          title={`Confirm ${confirmDialog.action}`}
          message={`Are you sure you want to ${confirmDialog.action} this user?`}
          onConfirm={confirmAction}
          onCancel={() => setConfirmDialog({ show: false, userId: null, action: null })}
          type={confirmDialog.action === 'delete' ? 'danger' : 'warning'}
        />
      )}
    </div>
  );
};

export default Users;