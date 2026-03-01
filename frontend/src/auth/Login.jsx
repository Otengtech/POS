import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaLock, FaEnvelope, FaSpinner, FaStore, FaCodeBranch, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    businessId: '',
    branchId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(credentials);

    if (result.success) {
      toast.success('Login successful!');
      window.location.href = '/dashboard';
    } else {
      toast.error(result.error || 'Login failed');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white p-3 sm:p-4">
      <div className="w-full max-w-sm sm:max-w-md mx-auto">
        {/* Header - Compact with rounded-full */}
        <div className="text-center mb-4 sm:mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 bg-black text-white rounded-full mb-2">
            <FaStore className="text-lg sm:text-xl" />
          </div>
          <h1 className="text-xl sm:text-2xl font-light tracking-wide text-black">
            POS SYSTEM
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Sign in to continue
          </p>
        </div>

        {/* Form - Compact */}
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
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
                value={credentials.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-3 sm:py-3 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password with Show/Hide */}
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full pl-9 pr-10 py-3 sm:py-3 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? (
                  <FaEyeSlash className="text-sm" />
                ) : (
                  <FaEye className="text-sm" />
                )}
              </button>
            </div>
          </div>

          {/* Business & Branch - Compact Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Business ID
              </label>
              <div className="relative">
                <FaStore className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  name="businessId"
                  value={credentials.businessId}
                  onChange={handleChange}
                  className="w-full pl-7 pr-2 py-3 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                  placeholder="ID"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">
                Branch ID
              </label>
              <div className="relative">
                <FaCodeBranch className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
                <input
                  type="text"
                  name="branchId"
                  value={credentials.branchId}
                  onChange={handleChange}
                  className="w-full pl-7 pr-2 py-3 text-sm border border-gray-300 rounded-lg focus:border-black focus:ring-1 focus:ring-black outline-none transition-all bg-white"
                  placeholder="ID"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button - Compact */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 sm:py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 active:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin mr-2 text-sm" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>

          {/* Forgot Password */}
          <div className="text-center">
            <button
              type="button"
              className="text-xs text-gray-500 hover:text-black transition-colors"
            >
              Forgot password?
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;