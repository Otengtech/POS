import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { branchApi } from '../../api/branches';
import { useToast } from '../../contexts/ToastContext';
import Loader from '../../common/Loader';
import { 
  MapPinIcon, 
  BuildingOfficeIcon,
  EnvelopeIcon, 
  PhoneIcon, 
  ClockIcon,
  UserIcon,
  CurrencyDollarIcon,
  ArrowLeftIcon,
  PencilIcon,
  TrashIcon,
  IdentificationIcon
} from '@heroicons/react/24/outline';
import ConfirmDialog from '../../common/ConfirmDialog';

const BranchDetails = () => {
  const [branch, setBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false });
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchBranchDetails();
  }, [id]);

  const fetchBranchDetails = async () => {
    try {
      setLoading(true);
      const response = await branchApi.getBranch(id);
      setBranch(response.data.branch);
    } catch (error) {
      toast.error('Failed to fetch branch details');
      navigate('/branches');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await branchApi.deleteBranch(id);
      toast.success('Branch deleted successfully');
      navigate('/branches');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete branch');
    } finally {
      setDeleteDialog({ isOpen: false });
    }
  };

  if (loading) {
    return <Loader fullPage />;
  }

  if (!branch) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Branch not found</p>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/branches')}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Branches
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
              <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
              {branch.name}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              Branch details and information
            </p>
          </div>
          <div className="flex space-x-2">
            <Link
              to={`/branches/${id}/edit`}
              className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <PencilIcon className="h-4 w-4 mr-2" />
              Edit
            </Link>
            <button
              onClick={() => setDeleteDialog({ isOpen: true })}
              className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            {/* Business Information */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-gray-400" />
                Business
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {branch.businessId?.name} ({branch.businessId?.code})
              </dd>
            </div>

            {/* Branch Code */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <IdentificationIcon className="h-5 w-5 mr-2 text-gray-400" />
                Branch Code
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{branch.code}</dd>
            </div>

            {/* Location */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <MapPinIcon className="h-5 w-5 mr-2 text-gray-400" />
                Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{branch.location}</dd>
            </div>

            {/* Contact Information */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <PhoneIcon className="h-5 w-5 mr-2 text-gray-400" />
                Contact
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>{branch.phone}</div>
                {branch.alternatePhone && <div>{branch.alternatePhone}</div>}
                {branch.email && <div>{branch.email}</div>}
              </dd>
            </div>

            {/* Address */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Address</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {branch.address?.digitalAddress && (
                  <div className="mb-1">
                    <span className="font-medium">Digital Address:</span> {branch.address.digitalAddress}
                  </div>
                )}
                {branch.address?.street && (
                  <div className="mb-1">{branch.address.street}</div>
                )}
                {branch.address?.landmark && (
                  <div className="mb-1">
                    <span className="font-medium">Landmark:</span> {branch.address.landmark}
                  </div>
                )}
                <div>
                  {branch.address?.city}, {branch.address?.region}
                </div>
              </dd>
            </div>

            {/* Operating Hours */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <ClockIcon className="h-5 w-5 mr-2 text-gray-400" />
                Operating Hours
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>Monday - Saturday: {branch.opensAt} - {branch.closesAt}</div>
                {branch.sundayHours?.isOpen ? (
                  <div>Sunday: {branch.sundayHours.opensAt} - {branch.sundayHours.closesAt}</div>
                ) : (
                  <div>Sunday: Closed</div>
                )}
              </dd>
            </div>

            {/* Management */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                Management
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {branch.managerName && (
                  <div className="mb-1">
                    <span className="font-medium">Manager:</span> {branch.managerName}
                  </div>
                )}
                {branch.managerPhone && (
                  <div>
                    <span className="font-medium">Manager Phone:</span> {branch.managerPhone}
                  </div>
                )}
              </dd>
            </div>

            {/* Financial */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 flex items-center">
                <CurrencyDollarIcon className="h-5 w-5 mr-2 text-gray-400" />
                Financial
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div>
                  <span className="font-medium">Opening Balance:</span> GH₵ {branch.openingBalance?.toFixed(2)}
                </div>
                <div>
                  <span className="font-medium">Staff Count:</span> {branch.staffCount || 1}
                </div>
              </dd>
            </div>

            {/* Status */}
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <span className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                  branch.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {branch.isActive ? 'Active' : 'Inactive'}
                </span>
                {branch.isHeadOffice && (
                  <span className="ml-2 inline-flex rounded-full px-2 text-xs font-semibold leading-5 bg-blue-100 text-blue-800">
                    Head Office
                  </span>
                )}
              </dd>
            </div>

            {/* Opening Date */}
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Opening Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(branch.openingDate).toLocaleDateString()}
              </dd>
            </div>

            {/* Notes */}
            {branch.notes && (
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Notes</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{branch.notes}</dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        onClose={() => setDeleteDialog({ isOpen: false })}
        onConfirm={handleDelete}
        title="Delete Branch"
        message="Are you sure you want to delete this branch? This action cannot be undone."
      />
    </div>
  );
};

export default BranchDetails;