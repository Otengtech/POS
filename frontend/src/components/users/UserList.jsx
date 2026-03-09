// components/users/UserList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUsers, FaPlus, FaSearch, FaUserTie, FaUserCog, FaUser, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const { getUsers, userRole: currentUserRole } = useAuth();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const result = await getUsers();
            if (result.success) {
                setUsers(result.data);
            } else {
                toast.error('Failed to fetch users');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const getRoleIcon = (role) => {
        switch(role) {
            case 'super_admin':
                return <FaUserTie className="text-purple-600" />;
            case 'owner':
                return <FaUserCog className="text-blue-600" />;
            default:
                return <FaUser className="text-green-600" />;
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

    const filteredUsers = users.filter(user => {
        const matchesSearch = 
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.role.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        
        return matchesSearch && matchesRole;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-2xl text-gray-400" />
            </div>
        );
    }

    const canCreateUsers = ['super_admin', 'owner'].includes(currentUserRole);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-light flex items-center mb-4 sm:mb-0">
                    <FaUsers className="mr-3 text-gray-400" />
                    Users
                </h1>
                {canCreateUsers && (
                    <div className="flex space-x-3">
                        {currentUserRole === 'super_admin' && (
                            <Link
                                to="/users/create-owner"
                                className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                            >
                                <FaUserTie className="mr-2" />
                                Add Owner
                            </Link>
                        )}
                        <Link
                            to="/users/create-staff"
                            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                        >
                            <FaPlus className="mr-2" />
                            Add Staff
                        </Link>
                    </div>
                )}
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                </div>
                <select
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                >
                    <option value="all">All Roles</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="owner">Owner</option>
                    <option value="manager">Manager</option>
                    <option value="cashier">Cashier</option>
                    <option value="inventory">Inventory</option>
                </select>
            </div>

            {/* Users List */}
            {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                    <FaUsers className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500">No users found</p>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Role
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Business
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Branch
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredUsers.map(user => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                {getRoleIcon(user.role)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.firstName} {user.lastName}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeColor(user.role)}`}>
                                            {user.role.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.businessName || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.branchName || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            to={`/users/${user.id}`}
                                            className="text-black hover:underline"
                                        >
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserList;