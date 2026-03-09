import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { businessApi } from '../../api/businesses';

const schema = yup.object({
  name: yup.string().required('Branch name is required'),
  code: yup.string().required('Branch code is required'),
  businessId: yup.string().required('Business is required'),
  phone: yup.string()
    .required('Phone number is required')
    .matches(/^(0|233)[2-9][0-9]{8}$/, 'Please enter a valid Ghana phone number'),
  alternatePhone: yup.string()
    .matches(/^(0|233)[2-9][0-9]{8}$/, 'Please enter a valid Ghana phone number'),
  email: yup.string().email('Invalid email'),
  location: yup.string().required('Location is required'),
  address: yup.object({
    digitalAddress: yup.string(),
    street: yup.string(),
    landmark: yup.string(),
    city: yup.string().required('City is required'),
    region: yup.string().required('Region is required'),
  }),
  opensAt: yup.string().required('Opening time is required'),
  closesAt: yup.string().required('Closing time is required'),
  sundayHours: yup.object({
    isOpen: yup.boolean(),
    opensAt: yup.string().when('isOpen', {
      is: true,
      then: yup.string().required('Sunday opening time is required'),
    }),
    closesAt: yup.string().when('isOpen', {
      is: true,
      then: yup.string().required('Sunday closing time is required'),
    }),
  }),
  managerName: yup.string(),
  managerPhone: yup.string().matches(/^(0|233)[2-9][0-9]{8}$/, 'Please enter a valid Ghana phone number'),
  openingBalance: yup.number().min(0).default(500),
});

const regions = [
  "Greater Accra", "Ashanti", "Western", "Eastern", "Northern",
  "Central", "Volta", "Brong Ahafo", "Upper East", "Upper West",
  "Western North", "Oti", "Ahafo", "Bono", "Bono East",
  "North East", "Savannah"
];

const BranchForm = ({ initialData, onSubmit, loading, onCancel }) => {
  const [businesses, setBusinesses] = useState([]);
  const [loadingBusinesses, setLoadingBusinesses] = useState(true);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      opensAt: '08:00',
      closesAt: '20:00',
      sundayHours: {
        isOpen: false,
        opensAt: '14:00',
        closesAt: '18:00',
      },
      openingBalance: 500,
      address: {
        city: 'Accra',
        region: 'Greater Accra',
      },
    },
  });

  const sundayOpen = watch('sundayHours.isOpen');

  useEffect(() => {
    fetchBusinesses();
  }, []);

  const fetchBusinesses = async () => {
    try {
      setLoadingBusinesses(true);
      const response = await businessApi.listBusinesses();
      setBusinesses(response.data.businesses || []);
    } catch (error) {
      console.error('Failed to fetch businesses:', error);
    } finally {
      setLoadingBusinesses(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Branch Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              Basic information about the branch
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="businessId" className="block text-sm font-medium text-gray-700">
                  Business *
                </label>
                <select
                  {...register('businessId')}
                  disabled={loadingBusinesses}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select a business</option>
                  {businesses.map(business => (
                    <option key={business._id} value={business._id}>
                      {business.name} - {business.code}
                    </option>
                  ))}
                </select>
                {errors.businessId && (
                  <p className="mt-1 text-sm text-red-600">{errors.businessId.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Branch Name *
                </label>
                <input
                  type="text"
                  {...register('name')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                  Branch Code *
                </label>
                <input
                  type="text"
                  {...register('code')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="ACC-OSU"
                />
                {errors.code && (
                  <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location *
                </label>
                <input
                  type="text"
                  {...register('location')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Oxford Street, Osu"
                />
                {errors.location && (
                  <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Contact Information</h3>
            <p className="mt-1 text-sm text-gray-500">
              Branch contact details
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="text"
                  {...register('phone')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="0244123456"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="alternatePhone" className="block text-sm font-medium text-gray-700">
                  Alternate Phone
                </label>
                <input
                  type="text"
                  {...register('alternatePhone')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="0244987654"
                />
              </div>

              <div className="col-span-6 sm:col-span-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  {...register('email')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Address (Ghana Format)</h3>
            <p className="mt-1 text-sm text-gray-500">
              Branch physical address
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6">
                <label htmlFor="address.digitalAddress" className="block text-sm font-medium text-gray-700">
                  Digital Address (GPS)
                </label>
                <input
                  type="text"
                  {...register('address.digitalAddress')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="GA-123-4567"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">
                  Street
                </label>
                <input
                  type="text"
                  {...register('address.street')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Oxford Street"
                />
              </div>

              <div className="col-span-6">
                <label htmlFor="address.landmark" className="block text-sm font-medium text-gray-700">
                  Landmark
                </label>
                <input
                  type="text"
                  {...register('address.landmark')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Opposite Koala"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  {...register('address.city')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.address?.city && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="address.region" className="block text-sm font-medium text-gray-700">
                  Region *
                </label>
                <select
                  {...register('address.region')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
                {errors.address?.region && (
                  <p className="mt-1 text-sm text-red-600">{errors.address.region.message}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Operating Hours</h3>
            <p className="mt-1 text-sm text-gray-500">
              Branch opening and closing times
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="opensAt" className="block text-sm font-medium text-gray-700">
                  Opens At *
                </label>
                <input
                  type="time"
                  {...register('opensAt')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.opensAt && (
                  <p className="mt-1 text-sm text-red-600">{errors.opensAt.message}</p>
                )}
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="closesAt" className="block text-sm font-medium text-gray-700">
                  Closes At *
                </label>
                <input
                  type="time"
                  {...register('closesAt')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.closesAt && (
                  <p className="mt-1 text-sm text-red-600">{errors.closesAt.message}</p>
                )}
              </div>

              <div className="col-span-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    {...register('sundayHours.isOpen')}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="sundayHours.isOpen" className="ml-2 block text-sm text-gray-900">
                    Open on Sundays
                  </label>
                </div>
              </div>

              {sundayOpen && (
                <>
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="sundayHours.opensAt" className="block text-sm font-medium text-gray-700">
                      Sunday Opens At
                    </label>
                    <input
                      type="time"
                      {...register('sundayHours.opensAt')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="sundayHours.closesAt" className="block text-sm font-medium text-gray-700">
                      Sunday Closes At
                    </label>
                    <input
                      type="time"
                      {...register('sundayHours.closesAt')}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="md:col-span-1">
            <h3 className="text-lg font-medium leading-6 text-gray-900">Management</h3>
            <p className="mt-1 text-sm text-gray-500">
              Branch manager details
            </p>
          </div>
          <div className="mt-5 md:mt-0 md:col-span-2">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="managerName" className="block text-sm font-medium text-gray-700">
                  Manager Name
                </label>
                <input
                  type="text"
                  {...register('managerName')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="managerPhone" className="block text-sm font-medium text-gray-700">
                  Manager Phone
                </label>
                <input
                  type="text"
                  {...register('managerPhone')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label htmlFor="openingBalance" className="block text-sm font-medium text-gray-700">
                  Opening Balance (GH₵)
                </label>
                <input
                  type="number"
                  step="0.01"
                  {...register('openingBalance')}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Saving...' : initialData ? 'Update Branch' : 'Create Branch'}
        </button>
      </div>
    </form>
  );
};

export default BranchForm;