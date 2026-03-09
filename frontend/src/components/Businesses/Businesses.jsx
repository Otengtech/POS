// components/business/Businesses.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaStore, FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Businesses = () => {
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const { getBusinesses, deleteBusiness, userRole } = useAuth();

    useEffect(() => {
        fetchBusinesses();
    }, []);

    const fetchBusinesses = async () => {
        try {
            const result = await getBusinesses();
            if (result.success) {
                setBusinesses(result.data);
            } else {
                toast.error('Failed to fetch businesses');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (businessId) => {
        if (!window.confirm('Are you sure you want to delete this business?')) {
            return;
        }

        try {
            const result = await deleteBusiness(businessId);
            if (result.success) {
                toast.success('Business deleted successfully');
                fetchBusinesses();
            } else {
                toast.error(result.error || 'Failed to delete business');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const filteredBusinesses = businesses.filter(business =>
        business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        business.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-2xl text-gray-400" />
            </div>
        );
    }

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-light flex items-center mb-4 sm:mb-0">
                    <FaStore className="mr-3 text-gray-400" />
                    Businesses
                </h1>
                {(userRole === 'super_admin' || userRole === 'owner') && (
                    <Link
                        to="/businesses/create"
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        Add Business
                    </Link>
                )}
            </div>

            {/* Search Bar */}
            <div className="mb-6">
                <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search businesses..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                </div>
            </div>

            {/* Businesses Grid */}
            {filteredBusinesses.length === 0 ? (
                <div className="text-center py-12">
                    <FaStore className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500">No businesses found</p>
                    {(userRole === 'super_admin' || userRole === 'owner') && (
                        <Link
                            to="/businesses/create"
                            className="inline-block mt-4 text-black hover:underline"
                        >
                            Create your first business
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBusinesses.map(business => (
                        <div
                            key={business.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                        <FaStore />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-medium">{business.name}</h3>
                                        <p className="text-xs text-gray-500">Code: {business.code}</p>
                                    </div>
                                </div>
                                {(userRole === 'super_admin' || userRole === 'owner') && (
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/businesses/${business.id}`}
                                            className="text-gray-400 hover:text-black transition-colors"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(business.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-600">
                                    <span className="font-medium">Email:</span> {business.email}
                                </p>
                                {business.phone && (
                                    <p className="text-gray-600">
                                        <span className="font-medium">Phone:</span> {business.phone}
                                    </p>
                                )}
                                {business.address && (
                                    <p className="text-gray-600">
                                        <span className="font-medium">Address:</span> {business.address}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-gray-100">
                                <Link
                                    to={`/branches?business=${business.id}`}
                                    className="text-sm text-black hover:underline"
                                >
                                    View Branches →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Businesses;