import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../common/Loader';
import Toast from '../../common/Toast';

const CreateOwner = () => {
  const navigate = useNavigate();
  const { createAdmin } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    role: 'owner',
    businessId: '',
    profileImage: null
  });
  
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

  // You'll need to fetch businesses list from API
  const [businesses, setBusinesses] = useState([]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.phoneNumber) newErrors.phoneNumber = 'Phone number is required';
    else if (!/^0[2-5][0-9]{8}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Enter a valid Ghana phone number';
    }
    
    if (!formData.businessId) newErrors.businessId = 'Please select a business';

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'profileImage') {
      setFormData(prev => ({ ...prev, profileImage: files[0] }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const result = await createAdmin(formData);

    if (result.success) {
      setToast({
        show: true,
        message: 'Owner created successfully!',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } else {
      setToast({
        show: true,
        message: result.error,
        type: 'error'
      });
    }

    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create Business Owner
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-6">
        {/* Profile Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Profile Image
          </label>
          <div className="mt-1 flex items-center">
            <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
              {formData.profileImage ? (
                <img
                  src={URL.createObjectURL(formData.profileImage)}
                  alt="Profile preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              )}
            </span>
            <input
              type="file"
              name="profileImage"
              accept="image/*"
              onChange={handleChange}
              className="ml-5 bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Business Selection */}
        <div>
          <label htmlFor="businessId" className="block text-sm font-medium text-gray-700">
            Select Business
          </label>
          <select
            id="businessId"
            name="businessId"
            value={formData.businessId}
            onChange={handleChange}
            className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${
              errors.businessId ? 'border-red-300' : 'border-gray-300'
            } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md`}
          >
            <option value="">Select a business</option>
            {businesses.map(business => (
              <option key={business.id} value={business.id}>
                {business.name}
              </option>
            ))}
          </select>
          {errors.businessId && (
            <p className="mt-2 text-sm text-red-600">{errors.businessId}</p>
          )}
        </div>

        {/* Rest of the form fields (same as CreateSuperAdmin but without role field) */}
        {/* ... First Name, Last Name, Email, Phone, Password fields ... */}

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={() => navigate('/users')}
            className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? <LoadingSpinner /> : 'Create Owner'}
          </button>
        </div>
      </form>

      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false, message: '', type: '' })}
        />
      )}
    </div>
  );
};

export default CreateOwner;