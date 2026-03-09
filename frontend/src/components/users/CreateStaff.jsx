// components/users/CreateStaff.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaStore, FaCodeBranch, FaSpinner, FaEye, FaEyeSlash, FaUserTag } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const CreateStaff = () => {
    const [staffData, setStaffData] = useState({
        businessId: '',
        branchId: '',
        role: '',
        firstName: '',
        lastName: '',
        email: '',
        password: ''
    });
    const [businesses, setBusinesses] = useState([]);
    const [branches, setBranches] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const { createStaff, getBusinesses, getBranches } = useAuth();
    const navigate = useNavigate();

    const roles = [
        { value: 'manager', label: 'Manager' },
        { value: 'cashier', label: 'Cashier' },
        { value: 'inventory', label: 'Inventory Staff' }
    ];

    useEffect(() => {
        fetchBusinesses();
    }, []);

    useEffect(() => {
        if (staffData.businessId) {
            fetchBranches(staffData.businessId);
        } else {
            setBranches([]);
        }
    }, [staffData.businessId]);

    const fetchBusinesses = async () => {
        try {
            const result = await getBusinesses();
            if (result.success) {
                setBusinesses(result.data);
            }
        } catch (error) {
            toast.error('Failed to fetch businesses');
        } finally {
            setFetchingData(false);
        }
    };

    const fetchBranches = async (businessId) => {
        try {
            const result = await getBranches(businessId);
            if (result.success) {
                setBranches(result.data);
            }
        } catch (error) {
            toast.error('Failed to fetch branches');
        }
    };

    const handleChange = (e) => {
        setStaffData({
            ...staffData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = () => {
        if (!staffData.businessId) {
            toast.error('Please select a business');
            return false;
        }
        if (!staffData.branchId) {
            toast.error('Please select a branch');
            return false;
        }
        if (!staffData.role) {
            toast.error('Please select a role');
            return false;
        }
        if (staffData.firstName.trim().length < 2) {
            toast.error('First name must be at least 2 characters');
            return false;
        }
        if (staffData.lastName.trim().length < 2) {
            toast.error('Last name must be at least 2 characters');
            return false;
        }
        if (!staffData.email.includes('@')) {
            toast.error('Please enter a valid email');
            return false;
        }
        if (staffData.password.length < 8) {
            toast.error('Password must be at least 8 characters');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = await createStaff(staffData);
            
            if (result.success) {
                toast.success(`${staffData.role} created successfully!`);
                setTimeout(() => {
                    navigate('/users');
                }, 2000);
            } else {
                toast.error(result.error || 'Failed to create staff');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-2xl text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-2xl font-light mb-6 flex items-center">
                    <FaUserTag className="mr-3 text-gray-400" />
                    Create Branch Staff
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Business Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Business *
                        </label>
                        <div className="relative">
                            <FaStore className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                name="businessId"
                                value={staffData.businessId}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                required
                            >
                                <option value="">Choose a business</option>
                                {businesses.map(business => (
                                    <option key={business.id} value={business.id}>
                                        {business.name} ({business.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Branch Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Branch *
                        </label>
                        <div className="relative">
                            <FaCodeBranch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                name="branchId"
                                value={staffData.branchId}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                required
                                disabled={!staffData.businessId}
                            >
                                <option value="">Choose a branch</option>
                                {branches.map(branch => (
                                    <option key={branch.id} value={branch.id}>
                                        {branch.name} ({branch.code})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Role Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Select Role *
                        </label>
                        <div className="relative">
                            <FaUserTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <select
                                name="role"
                                value={staffData.role}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                required
                            >
                                <option value="">Choose a role</option>
                                {roles.map(role => (
                                    <option key={role.value} value={role.value}>
                                        {role.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* First Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name *
                        </label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="firstName"
                                value={staffData.firstName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                placeholder="Enter first name"
                                required
                                minLength={2}
                            />
                        </div>
                    </div>

                    {/* Last Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name *
                        </label>
                        <div className="relative">
                            <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                name="lastName"
                                value={staffData.lastName}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                placeholder="Enter last name"
                                required
                                minLength={2}
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email *
                        </label>
                        <div className="relative">
                            <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="email"
                                name="email"
                                value={staffData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                placeholder="staff@example.com"
                                required
                            />
                        </div>
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Password *
                        </label>
                        <div className="relative">
                            <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={staffData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                                placeholder="••••••••"
                                required
                                minLength={8}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Creating Staff...
                            </>
                        ) : (
                            'Create Staff'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateStaff;