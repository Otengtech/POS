import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  FaUser, 
  FaEnvelope, 
  FaLock, 
  FaSpinner, 
  FaEye, 
  FaEyeSlash,
  FaUserShield 
} from 'react-icons/fa';
import Toast from '../common/Toast';

const CreateSuperAdmin = () => {
  const navigate = useNavigate();
  const { createSuperAdmin } = useAuth();
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState({ show: false, message: '', type: '' });

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

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
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

    // Remove confirmPassword before sending to API
    const { confirmPassword, ...apiData } = formData;
    
    setLoading(true);
    const result = await createSuperAdmin(apiData);

    if (result.success) {
      setToast({
        show: true,
        message: 'Super Admin created successfully! Redirecting to login...',
        type: 'success'
      });

      setTimeout(() => {
        navigate('/login');
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
    <div className="min-h-screen flex items-center justify-center bg-white p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-black text-white rounded-full mb-3">
            <FaUserShield className="text-xl sm:text-2xl" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-light tracking-wide text-black">
            CREATE SUPER ADMIN
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            First-time setup - Create system administrator
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              First Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-3 text-sm border ${
                  errors.firstName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white`}
                placeholder="Enter first name"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Last Name
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-3 text-sm border ${
                  errors.lastName ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white`}
                placeholder="Enter last name"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-9 pr-3 py-3 text-sm border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white`}
                placeholder="your@email.com"
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-9 pr-10 py-3 text-sm border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`w-full pl-9 pr-10 py-3 text-sm border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash className="text-sm" /> : <FaEye className="text-sm" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Example Data Helper */}
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
            <p className="text-xs text-gray-500 mb-1">Example data:</p>
            <code className="text-xs text-gray-600 block">
              {`{ firstName: "Super", lastName: "Admin", email: "super@admin.com", password: "Password123" }`}
            </code>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2 text-sm" />
                Creating...
              </>
            ) : (
              'Create Super Admin'
            )}
          </button>
        </form>
      </div>

      {/* Toast Notification */}
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

export default CreateSuperAdmin;