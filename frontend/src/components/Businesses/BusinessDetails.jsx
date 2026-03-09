import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { businessApi } from '../../api/businesses';
import { branchApi } from '../../api/branches';
import { useToast } from '../../contexts/ToastContext';
import Loader from '../../common/Loader';
import { 
  BuildingOfficeIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  MapPinIcon,
  GlobeAltIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  MapPinIcon as BranchIcon
} from '@heroicons/react/24/outline';
import ConfirmDialog from '../../common/ConfirmDialog';

const BusinessDetails = () => {
  const [business, setBusiness] = useState(null);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, businessId: null });
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchBusinessDetails();
  }, [id]);

  const fetchBusinessDetails = async () => {
    try {
      setLoading(true);
      const [businessRes, branchesRes] = await Promise.all([
        businessApi.getBusiness(id),
        branchApi.listBranches({ businessId: id })
      ]);
      setBusiness(businessRes.data.business);
      setBranches(branchesRes.data.branches || []);
    } catch (error) {
      toast.error('Failed to fetch business details');
      navigate('/businesses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await businessApi.deleteBusiness(id);
      toast.success('Business deleted successfully');
      navigate('/businesses');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete business');
    } finally {
      setDeleteDialog({ isOpen: false, businessId: null });
    }
  };

  if (loading) {
    return <Loader fullPage />;
  }

  if (!business) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Business not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/businesses')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Businesses
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Business Information
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Details and settings for {business.name}
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/businesses/${id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={() => setDeleteDialog({ isOpen: true, businessId: id })}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400" />
                Business Name
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{business.name}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Business Code</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.code}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <EnvelopeIcon className="h-5 w-5 mr-2 text-gray-400" />
                Email
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{business.email}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                Phone
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{business.phone}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                Address
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{business.address}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Business Type</dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">{business.businessType}</dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                Tax Rate
              </dt>
              <dd className="mt-1 text-sm text-gray-900">{business.taxRate}%</dd>
            </div>
            {business.website && (
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500 flex items-center">
                  <GlobeAltIcon className="h-5 w-5 mr-2 text-gray-400" />
                  Website
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-900">
                    {business.website}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Branches Section */}
      <div className="mt-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <BranchIcon className="h-5 w-5 mr-2 text-gray-400" />
                Branches
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                Branches under this business
              </p>
            </div>
            <Link
              to={`/branches/create?businessId=${id}`}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Branch
            </Link>
          </div>
          <div className="border-t border-gray-200">
            {branches.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {branches.map((branch) => (
                  <li key={branch._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                    <Link to={`/branches/${branch._id}`} className="block">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <BranchIcon className="h-6 w-6 text-gray-400" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-indigo-600">{branch.name}</div>
                            <div className="text-sm text-gray-500">{branch.code}</div>
                          </div>
                        </div>
                        <div className="ml-2 flex-shrink-0">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}>
                            {branch.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 sm:flex sm:justify-between">
                        <div className="sm:flex">
                          <div className="mr-6 flex items-center text-sm text-gray-500">
                            <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {branch.location}
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <PhoneIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            {branch.phone}
                          </div>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                          <span>Opens: {branch.opensAt} - {branch.closesAt}</span>
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-12">
                <BranchIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No branches</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new branch.
                </p>
                <div className="mt-6">
                  <Link
                    to={`/branches/create?businessId=${id}`}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Branch
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false, businessId: null })}
        onConfirm={handleDelete}
        title="Delete Business"
        message="Are you sure you want to delete this business? This action cannot be undone and will affect all associated branches and data."
      />
    </div>
  );
};

export default BusinessDetails;