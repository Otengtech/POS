// components/users/UserDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaStore, FaCodeBranch, FaUserTag, FaArrowLeft, FaEdit, FaTrash, FaSpinner, FaSave } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        role: '',
        businessId: '',
        branchId: ''
    });
    const [businesses, setBusinesses] = useState([]);
    const [branches, setBranches] = useState([]);
    const { getUser, updateUser, deleteUser, getBusinesses, getBranches, userRole: currentUserRole } = useAuth();

    useEffect(() => {
        fetchUserDetails();
        fetchBusinesses();
    }, [userId]);

    useEffect(() => {
        if (formData.businessId) {
            fetchBranches(formData.businessId);
        }
    }, [formData.businessId]);

    const fetchUserDetails = async () => {
        try {
            const result = await getUser(userId);
            if (result.success) {
                setUser(result.data);
                setFormData({
                    firstName: result.data.firstName || '',
                    lastName: result.data.lastName || '',
                    email: result.data.email || '',
                    role: result.data.role || '',
                    businessId: result.data.businessId || '',
                    branchId: result.data.branchId || ''
                });
            } else {
                toast.error('Failed to fetch user details');
                navigate('/users');
            }
        } catch (error) {
            toast.error('An error occurred');
            navigate('/users');
        } finally {
            setLoading(false);
        }
    };

    const fetchBusinesses = async () => {
        try {
            const result = await getBusinesses();
            if (result.success) {
                setBusinesses(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch businesses:', error);
        }
    };

    const fetchBranches = async (businessId) => {
        try {
            const result = await getBranches(businessId);
            if (result.success) {
                setBranches(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch branches:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'businessId' ? { branchId: '' } : {})
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        try {
            const result = await updateUser(userId, formData);
            if (result.success) {
                toast.success('User updated successfully');
                setUser(result.data);
                setIsEditing(false);
            } else {
                toast.error(result.error || 'Failed to update user');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this user?')) {
            return;
        }

        try {
            const result = await deleteUser(userId);
            if (result.success) {
                toast.success('User deleted successfully');
                navigate('/users');
            } else {
                toast.error(result.error || 'Failed to delete user');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const getRoleBadgeColor = (role) => {
        switch(role) {
            case 'super_admin':
                return 'bg-purple-100 text-purple-800';
            case 'owner':
                return 'bg-blue-100 text-blue-800';
            case 'manager':
                return 'bg-green-100 text-green-800';
            case 'cashier':
                return 'bg-yellow-100 text-yellow-800';
            case 'inventory':
                return 'bg-orange-100 text-orange-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const canEdit = ['super_admin', 'owner'].includes(currentUserRole) && 
                   (currentUserRole === 'super_admin' || user?.role !== 'super_admin');

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-2xl text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    <button
                        onClick={() => navigate('/users')}
                        className="mr-4 text-gray-400 hover:text-black transition-colors"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-light flex items-center">
                        <FaUser className="mr-3 text-gray-400" />
                        User Details
                    </h1>
                </div>
                {canEdit && (
                    <div className="flex space-x-3">
                        {!isEditing ? (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                                >
                                    <FaEdit className="mr-2" />
                                    Edit
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center"
                                >
                                    <FaTrash className="mr-2" />
                                    Delete
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* User Details Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    First Name *
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                    required
                                    minLength={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Last Name *
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                    required
                                    minLength={2}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                    disabled={currentUserRole !== 'super_admin'}
                                >
                                    <option value="manager">Manager</option>
                                    <option value="cashier">Cashier</option>
                                    <option value="inventory">Inventory</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business
                                </label>
                                <select
                                    name="businessId"
                                    value={formData.businessId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                >
                                    <option value="">Select Business</option>
                                    {businesses.map(business => (
                                        <option key={business.id} value={business.id}>
                                            {business.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Branch
                                </label>
                                <select
                                    name="branchId"
                                    value={formData.branchId}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                    disabled={!formData.businessId}
                                >
                                    <option value="">Select Branch</option>
                                    {branches.map(branch => (
                                        <option key={branch.id} value={branch.id}>
                                            {branch.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <button
                            type="submit"
                            disabled={saving}
                            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 flex items-center"
                        >
                            {saving ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <FaSave className="mr-2" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </form>
                ) : (
                    <div className="space-y-6">
                        {/* User Info */}
                        <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-2xl">
                                <FaUser />
                            </div>
                            <div className="ml-4">
                                <h2 className="text-2xl font-medium">
                                    {user.firstName} {user.lastName}
                                </h2>
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                    {user.role.replace('_', ' ').toUpperCase()}
                                </span>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 mb-1">
                                    <FaEnvelope className="inline mr-2" />
                                    Email
                                </label>
                                <p>{user.email}</p>
                            </div>
                            {user.businessName && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        <FaStore className="inline mr-2" />
                                        Business
                                    </label>
                                    <p>{user.businessName}</p>
                                </div>
                            )}
                            {user.branchName && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        <FaCodeBranch className="inline mr-2" />
                                        Branch
                                    </label>
                                    <p>{user.branchName}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetails;