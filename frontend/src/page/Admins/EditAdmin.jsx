// page/Forms/AdminForm.jsx
import React, { useState } from 'react';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  ShieldCheckIcon,
  CameraIcon,
  XMarkIcon,
  CheckIcon
} from '@heroicons/react/24/outline';

const AdminForm = ({ initialData, onSubmit, loading, onCancel, isEdit }) => {
  const [formData, setFormData] = useState({
    firstName: initialData?.firstName || '',
    lastName: initialData?.lastName || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    role: initialData?.role || 'admin',
    password: '',
    confirmPassword: '',
    profileImage: initialData?.profileImage || '',
    isActive: initialData?.isActive ?? true
  });

  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(initialData?.profileImage || '');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!isEdit && !formData.password) {
      newErrors.password = 'Password is required';
    }
    if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Remove confirmPassword before submitting
    const { confirmPassword, ...submitData } = formData;
    onSubmit(submitData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Profile Image Upload */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Profile preview"
              className="h-24 w-24 rounded-xl object-cover border-2 border-[#AFC1B3]/20"
            />
          ) : (
            <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-[#8FA5A0] to-[#AFC1B3] flex items-center justify-center">
              <UserIcon className="h-12 w-12 text-white" />
            </div>
          )}
          <label
            htmlFor="profile-image"
            className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-lg shadow-lg border border-[#AFC1B3]/20 cursor-pointer hover:bg-[#F0F5F2] transition-colors"
          >
            <CameraIcon className="h-4 w-4 text-[#8FA5A0]" />
          </label>
          <input
            type="file"
            id="profile-image"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900">Profile Picture</p>
          <p className="text-xs text-[#8FA5A0]">JPG, PNG or GIF (Max. 2MB)</p>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* First Name */}
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
            First Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-[#8FA5A0]" />
            </div>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.firstName ? 'border-red-300' : 'border-[#AFC1B3]/30'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AFC1B3] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm`}
              placeholder="John"
            />
          </div>
          {errors.firstName && (
            <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
            Last Name <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <UserIcon className="h-5 w-5 text-[#8FA5A0]" />
            </div>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.lastName ? 'border-red-300' : 'border-[#AFC1B3]/30'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AFC1B3] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm`}
              placeholder="Doe"
            />
          </div>
          {errors.lastName && (
            <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <EnvelopeIcon className="h-5 w-5 text-[#8FA5A0]" />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`block w-full pl-10 pr-3 py-3 border ${
                errors.email ? 'border-red-300' : 'border-[#AFC1B3]/30'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AFC1B3] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm`}
              placeholder="john.doe@example.com"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-xs text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-[#8FA5A0]" />
            </div>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="block w-full pl-10 pr-3 py-3 border border-[#AFC1B3]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AFC1B3] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
              placeholder="+233 XX XXX XXXX"
            />
          </div>
        </div>

        {/* Role */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
            Role <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ShieldCheckIcon className="h-5 w-5 text-[#8FA5A0]" />
            </div>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="block w-full pl-10 pr-10 py-3 border border-[#AFC1B3]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AFC1B3] focus:border-transparent transition-all duration-200 appearance-none bg-white/80 backdrop-blur-sm"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-[#8FA5A0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Status (for edit mode) */}
        {isEdit && (
          <div>
            <label htmlFor="isActive" className="block text-sm font-medium text-gray-700 mb-2">
              Account Status
            </label>
            <div className="flex items-center space-x-4 h-full pt-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isActive"
                  value="true"
                  checked={formData.isActive === true}
                  onChange={() => setFormData(prev => ({ ...prev, isActive: true }))}
                  className="h-4 w-4 text-[#AFC1B3] focus:ring-[#AFC1B3] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Active</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="isActive"
                  value="false"
                  checked={formData.isActive === false}
                  onChange={() => setFormData(prev => ({ ...prev, isActive: false }))}
                  className="h-4 w-4 text-[#AFC1B3] focus:ring-[#AFC1B3] border-gray-300"
                />
                <span className="ml-2 text-sm text-gray-700">Inactive</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Password Section */}
      <div className="border-t border-[#AFC1B3]/20 pt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">
          {isEdit ? 'Change Password (leave blank to keep current)' : 'Password'}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              {!isEdit && <span className="text-red-500">*</span>} Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border ${
                errors.password ? 'border-red-300' : 'border-[#AFC1B3]/30'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AFC1B3] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-600">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
              {!isEdit && <span className="text-red-500">*</span>} Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`block w-full px-4 py-3 border ${
                errors.confirmPassword ? 'border-red-300' : 'border-[#AFC1B3]/30'
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-[#AFC1B3] focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-3 pt-6 border-t border-[#AFC1B3]/20">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2.5 border border-[#AFC1B3]/30 rounded-xl text-sm font-medium text-[#8FA5A0] bg-white hover:bg-[#F0F5F2] transition-all duration-200"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-[#8FA5A0] to-[#AFC1B3] text-white text-sm font-medium rounded-xl hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving...
            </>
          ) : (
            <>
              <CheckIcon className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;