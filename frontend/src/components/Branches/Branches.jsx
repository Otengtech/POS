// components/branches/Branches.jsx
import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaCodeBranch, FaPlus, FaSearch, FaEdit, FaTrash, FaSpinner, FaStore } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

const Branches = () => {
    const [searchParams] = useSearchParams();
    const businessIdFilter = searchParams.get('business');
    
    const [branches, setBranches] = useState([]);
    const [businesses, setBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState(businessIdFilter || 'all');
    const { getBranches, getBusinesses, deleteBranch, userRole } = useAuth();

    useEffect(() => {
        fetchBusinesses();
    }, []);

    useEffect(() => {
        if (selectedBusiness === 'all') {
            fetchAllBranches();
        } else if (selectedBusiness) {
            fetchBranches(selectedBusiness);
        }
    }, [selectedBusiness]);

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

    const fetchAllBranches = async () => {
        setLoading(true);
        try {
            // This would need an API endpoint to get all branches
            // For now, fetch branches for each business
            const allBranches = [];
            for (const business of businesses) {
                const result = await getBranches(business.id);
                if (result.success) {
                    allBranches.push(...result.data.map(b => ({ ...b, businessName: business.name })));
                }
            }
            setBranches(allBranches);
        } catch (error) {
            toast.error('Failed to fetch branches');
        } finally {
            setLoading(false);
        }
    };

    const fetchBranches = async (businessId) => {
        setLoading(true);
        try {
            const result = await getBranches(businessId);
            if (result.success) {
                const business = businesses.find(b => b.id === businessId);
                setBranches(result.data.map(b => ({ ...b, businessName: business?.name })));
            } else {
                toast.error('Failed to fetch branches');
            }
        } catch (error) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (branchId) => {
        if (!window.confirm('Are you sure you want to delete this branch?')) {
            return;
        }

        try {
            const result = await deleteBranch(branchId);
            if (result.success) {
                toast.success('Branch deleted successfully');
                if (selectedBusiness === 'all') {
                    fetchAllBranches();
                } else {
                    fetchBranches(selectedBusiness);
                }
            } else {
                toast.error(result.error || 'Failed to delete branch');
            }
        } catch (error) {
            toast.error('An error occurred');
        }
    };

    const filteredBranches = branches.filter(branch =>
        branch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        branch.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (branch.businessName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading && branches.length === 0) {
        return (
            <div className="flex items-center justify-center h-64">
                <FaSpinner className="animate-spin text-2xl text-gray-400" />
            </div>
        );
    }

    const canManage = ['super_admin', 'owner'].includes(userRole);

    return (
        <div className="p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h1 className="text-2xl font-light flex items-center mb-4 sm:mb-0">
                    <FaCodeBranch className="mr-3 text-gray-400" />
                    Branches
                </h1>
                {canManage && (
                    <Link
                        to="/branches/create"
                        className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center"
                    >
                        <FaPlus className="mr-2" />
                        Add Branch
                    </Link>
                )}
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <div className="flex-1 relative">
                    <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search branches..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                    />
                </div>
                <select
                    value={selectedBusiness}
                    onChange={(e) => setSelectedBusiness(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none"
                >
                    <option value="all">All Businesses</option>
                    {businesses.map(business => (
                        <option key={business.id} value={business.id}>
                            {business.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Branches Grid */}
            {filteredBranches.length === 0 ? (
                <div className="text-center py-12">
                    <FaCodeBranch className="mx-auto text-4xl text-gray-300 mb-3" />
                    <p className="text-gray-500">No branches found</p>
                    {canManage && (
                        <Link
                            to="/branches/create"
                            className="inline-block mt-4 text-black hover:underline"
                        >
                            Create your first branch
                        </Link>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredBranches.map(branch => (
                        <div
                            key={branch.id}
                            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center">
                                        <FaCodeBranch />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="font-medium">{branch.name}</h3>
                                        <p className="text-xs text-gray-500">Code: {branch.code}</p>
                                    </div>
                                </div>
                                {canManage && (
                                    <div className="flex space-x-2">
                                        <Link
                                            to={`/branches/${branch.id}`}
                                            className="text-gray-400 hover:text-black transition-colors"
                                        >
                                            <FaEdit />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(branch.id)}
                                            className="text-gray-400 hover:text-red-600 transition-colors"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2 text-sm">
                                {branch.businessName && (
                                    <p className="text-gray-600 flex items-center">
                                        <FaStore className="mr-2 text-xs" />
                                        {branch.businessName}
                                    </p>
                                )}
                                {branch.address && (
                                    <p className="text-gray-600">{branch.address}</p>
                                )}
                                {branch.phone && (
                                    <p className="text-gray-600">{branch.phone}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Branches;