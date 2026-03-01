import React, { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaUserShield, FaEnvelope, FaPhone, FaLock, FaTimes, FaUser, FaCheck, FaBan } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '../common/LoadingSpinner';

const Users = () => {
  const { userRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [roleFilter, setRoleFilter] = useState('');

  const roles = [
    { value: 'super_admin', label: 'Super Admin', level: 1 },
    { value: 'owner', label: 'Owner', level: 2 },
    { value: 'manager', label: 'Manager', level: 3 },
    { value: 'cashier', label: 'Cashier', level: 4 },
    { value: 'inventory', label: 'Inventory Staff', level: 4 },
  ];

  useEffect(() => {
    setTimeout(() => {
      setUsers([
        { id: 1, name: 'John Doe', email: 'john@example.com', phone: '123-456-7890', role: 'super_admin', status: 'active', lastLogin: '2024-01-15 09:30 AM' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '123-456-7891', role: 'owner', status: 'active', lastLogin: '2024-01-15 10:15 AM' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '123-456-7892', role: 'manager', status: 'active', lastLogin: '2024-01-14 04:45 PM' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', phone: '123-456-7893', role: 'cashier', status: 'inactive', lastLogin: '2024-01-10 02:30 PM' },
        { id: 5, name: 'Charlie Wilson', email: 'charlie@example.com', phone: '123-456-7894', role: 'inventory', status: 'active', lastLogin: '2024-01-15 08:00 AM' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'cashier',
    password: '',
    confirmPassword: '',
    status: 'active',
  });

  const canManageUsers = ['super_admin', 'owner'].includes(userRole);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!editingUser && formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      // API call here
      toast.success(editingUser ? 'User updated successfully' : 'User added successfully');
      setShowModal(false);
      resetForm();
    } catch (error) {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // API call here
        setUsers(users.filter(u => u.id !== id));
        toast.success('User deleted successfully');
      } catch (error) {
        toast.error('Delete failed');
      }
    }
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      // API call here
      setUsers(users.map(u => 
        u.id === id ? { ...u, status: currentStatus === 'active' ? 'inactive' : 'active' } : u
      ));
      toast.success(`User ${currentStatus === 'active' ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Status update failed');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: 'cashier',
      password: '',
      confirmPassword: '',
      status: 'active',
    });
    setEditingUser(null);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-light tracking-tight text-black">
              Users
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage system users and permissions
            </p>
          </div>
          {canManageUsers && (
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center justify-center px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              <FaPlus className="mr-2 text-xs" />
              Add User
            </button>
          )}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6 space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center justify-center px-4 py-2 text-sm border rounded-lg transition-colors ${
              showFilters || roleFilter
                ? 'bg-black text-white border-black' 
                : 'bg-white text-gray-600 border-gray-300 hover:border-black hover:text-black'
            }`}
          >
            <FaUserShield className="mr-2 text-xs" />
            Roles
          </button>
        </div>

        {/* Role Filter Panel */}
        {showFilters && (
          <div className="p-4 border border-gray-200 rounded-lg bg-gray-50 animate-fade-in">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-gray-500 mr-2">Filter by role:</span>
              <button
                onClick={() => setRoleFilter('')}
                className={`px-3 py-1 text-xs rounded-full transition-colors ${
                  roleFilter === '' 
                    ? 'bg-black text-white' 
                    : 'bg-white text-gray-600 border border-gray-300 hover:border-black'
                }`}
              >
                All
              </button>
              {roles.map(role => (
                <button
                  key={role.value}
                  onClick={() => setRoleFilter(role.value)}
                  className={`px-3 py-1 text-xs rounded-full transition-colors ${
                    roleFilter === role.value 
                      ? 'bg-black text-white' 
                      : 'bg-white text-gray-600 border border-gray-300 hover:border-black'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Users Grid */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-12 border border-gray-200 rounded-lg">
          <FaUser className="mx-auto text-4xl text-gray-300 mb-3" />
          <p className="text-gray-500 text-sm">No users found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="border border-gray-200 rounded-lg hover:border-black transition-colors bg-white">
              {/* User Header */}
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-black">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-black text-sm">{user.name}</h3>
                      <p className="text-xs text-gray-400">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className={`text-xs px-2 py-1 rounded ${
                      user.role === 'super_admin' ? 'bg-gray-900 text-white' :
                      user.role === 'owner' ? 'bg-gray-800 text-white' :
                      user.role === 'manager' ? 'bg-gray-700 text-white' :
                      user.role === 'inventory' ? 'bg-gray-600 text-white' :
                      'bg-gray-500 text-white'
                    }`}>
                      {roles.find(r => r.value === user.role)?.label}
                    </span>
                  </div>
                </div>

                {/* User Details */}
                <div className="space-y-2 mb-3">
                  <div className="flex items-center text-xs text-gray-500">
                    <FaPhone className="mr-2 text-gray-400" size={10} />
                    {user.phone}
                  </div>
                  <div className="flex items-center text-xs text-gray-500">
                    <FaLock className="mr-2 text-gray-400" size={10} />
                    Last login: {user.lastLogin}
                  </div>
                </div>

                {/* Status and Actions */}
                <div className="pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-xs ${
                        user.status === 'active' ? 'text-black' : 'text-gray-400'
                      }`}>
                        {user.status === 'active' ? (
                          <><FaCheck size={8} /> Active</>
                        ) : (
                          <><FaBan size={8} /> Inactive</>
                        )}
                      </span>
                    </div>
                    
                    {canManageUsers && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleStatusToggle(user.id, user.status)}
                          className={`p-1.5 text-xs rounded transition-colors ${
                            user.status === 'active'
                              ? 'text-gray-400 hover:text-black hover:bg-gray-100'
                              : 'text-gray-400 hover:text-black hover:bg-gray-100'
                          }`}
                          title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                        >
                          {user.status === 'active' ? <FaBan size={12} /> : <FaCheck size={12} />}
                        </button>
                        <button
                          onClick={() => {
                            setEditingUser(user);
                            setFormData({ ...user, password: '', confirmPassword: '' });
                            setShowModal(true);
                          }}
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                          title="Edit"
                        >
                          <FaEdit size={12} />
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="p-1.5 text-gray-400 hover:text-black hover:bg-gray-100 rounded transition-colors"
                          title="Delete"
                        >
                          <FaTrash size={12} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Results Count */}
      <div className="mt-4 text-xs text-gray-400">
        Showing {filteredUsers.length} of {users.length} users
      </div>

      {/* Add/Edit User Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-black">
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-1 text-gray-400 hover:text-black transition-colors"
                >
                  <FaTimes />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Phone *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Role *
                    </label>
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
                      required
                    >
                      {roles.filter(r => {
                        if (userRole === 'super_admin') return true;
                        if (userRole === 'owner') return r.value !== 'super_admin';
                        return false;
                      }).map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {!editingUser && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Password *
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                          required={!editingUser}
                          minLength="6"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          Confirm Password *
                        </label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                          required={!editingUser}
                          minLength="6"
                        />
                      </div>
                    </div>
                  </>
                )}

                {editingUser && (
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none bg-white"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                )}

                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-black transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    {editingUser ? 'Update' : 'Save'} User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;