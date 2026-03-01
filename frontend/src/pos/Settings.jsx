import React, { useState } from 'react';
import { 
  FaStore, FaPalette, FaBell, FaLock, 
  FaLanguage, FaSave, FaUpload, FaGlobe,
  FaCreditCard, FaTruck, FaReceipt, FaMoneyBill
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [settings, setSettings] = useState({
    general: {
      storeName: 'My POS Store',
      storeEmail: 'store@example.com',
      storePhone: '+1 234 567 890',
      address: '123 Business St, City, State 12345',
      taxRate: '10',
      currency: 'USD',
      timezone: 'America/New_York',
    },
    appearance: {
      theme: 'light',
      primaryColor: '#facc15',
      secondaryColor: '#000000',
      logo: null,
      favicon: null,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      lowStockAlert: true,
      dailyReport: true,
      weeklyReport: false,
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90',
      maxLoginAttempts: '5',
    },
    payment: {
      cashEnabled: true,
      cardEnabled: true,
      mobileEnabled: false,
      defaultPaymentMethod: 'cash',
      receiptPrinter: true,
      printReceipt: true,
    },
    localization: {
      language: 'en',
      dateFormat: 'MM/DD/YYYY',
      timeFormat: '12h',
      numberFormat: '1,234.56',
    },
  });

  const tabs = [
    { id: 'general', name: 'General', icon: FaStore },
    { id: 'appearance', name: 'Appearance', icon: FaPalette },
    { id: 'notifications', name: 'Notifications', icon: FaBell },
    { id: 'security', name: 'Security', icon: FaLock },
    { id: 'payment', name: 'Payment', icon: FaCreditCard },
    { id: 'localization', name: 'Localization', icon: FaGlobe },
  ];

  // Input field classes
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent outline-none transition-all";
  const labelClass = "block text-sm font-medium text-gray-700 mb-2";
  const buttonPrimaryClass = "px-4 py-2 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium";
  const buttonSecondaryClass = "px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium";

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    // Clear error for this field if it exists
    if (errors[`${section}.${field}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`${section}.${field}`];
        return newErrors;
      });
    }
  };

  const validateSettings = () => {
    const newErrors = {};

    // General settings validation
    if (!settings.general.storeName.trim()) {
      newErrors['general.storeName'] = 'Store name is required';
    }

    if (!settings.general.storeEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors['general.storeEmail'] = 'Valid email is required';
    }

    if (!settings.general.storePhone.match(/^[\+\d\s-]+$/)) {
      newErrors['general.storePhone'] = 'Valid phone number is required';
    }

    const taxRate = parseFloat(settings.general.taxRate);
    if (isNaN(taxRate) || taxRate < 0 || taxRate > 100) {
      newErrors['general.taxRate'] = 'Tax rate must be between 0 and 100';
    }

    // Security settings validation
    const sessionTimeout = parseInt(settings.security.sessionTimeout);
    if (isNaN(sessionTimeout) || sessionTimeout < 5 || sessionTimeout > 480) {
      newErrors['security.sessionTimeout'] = 'Session timeout must be between 5 and 480 minutes';
    }

    const passwordExpiry = parseInt(settings.security.passwordExpiry);
    if (isNaN(passwordExpiry) || passwordExpiry < 0 || passwordExpiry > 365) {
      newErrors['security.passwordExpiry'] = 'Password expiry must be between 0 and 365 days';
    }

    const maxAttempts = parseInt(settings.security.maxLoginAttempts);
    if (isNaN(maxAttempts) || maxAttempts < 3 || maxAttempts > 10) {
      newErrors['security.maxLoginAttempts'] = 'Max login attempts must be between 3 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateSettings()) {
      toast.error('Please fix the validation errors');
      return;
    }

    setLoading(true);
    try {
      // API call here
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        toast.error('Logo must be less than 2MB');
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file');
        return;
      }

      // Handle file upload
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings(prev => ({
          ...prev,
          appearance: {
            ...prev.appearance,
            logo: reader.result
          }
        }));
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Store Name
          </label>
          <input
            type="text"
            value={settings.general.storeName}
            onChange={(e) => handleSettingChange('general', 'storeName', e.target.value)}
            className={`${inputClass} ${errors['general.storeName'] ? 'border-red-500' : ''}`}
            placeholder="Enter store name"
          />
          {errors['general.storeName'] && (
            <p className="mt-1 text-sm text-red-500">{errors['general.storeName']}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Store Email
          </label>
          <input
            type="email"
            value={settings.general.storeEmail}
            onChange={(e) => handleSettingChange('general', 'storeEmail', e.target.value)}
            className={`${inputClass} ${errors['general.storeEmail'] ? 'border-red-500' : ''}`}
            placeholder="store@example.com"
          />
          {errors['general.storeEmail'] && (
            <p className="mt-1 text-sm text-red-500">{errors['general.storeEmail']}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Store Phone
          </label>
          <input
            type="tel"
            value={settings.general.storePhone}
            onChange={(e) => handleSettingChange('general', 'storePhone', e.target.value)}
            className={`${inputClass} ${errors['general.storePhone'] ? 'border-red-500' : ''}`}
            placeholder="+1 234 567 890"
          />
          {errors['general.storePhone'] && (
            <p className="mt-1 text-sm text-red-500">{errors['general.storePhone']}</p>
          )}
        </div>
        <div>
          <label className={labelClass}>
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={settings.general.taxRate}
            onChange={(e) => handleSettingChange('general', 'taxRate', e.target.value)}
            className={`${inputClass} ${errors['general.taxRate'] ? 'border-red-500' : ''}`}
            min="0"
            max="100"
            step="0.1"
            placeholder="10"
          />
          {errors['general.taxRate'] && (
            <p className="mt-1 text-sm text-red-500">{errors['general.taxRate']}</p>
          )}
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Store Address
        </label>
        <textarea
          value={settings.general.address}
          onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
          rows="3"
          className={inputClass}
          placeholder="Enter store address"
        ></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className={inputClass}
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className={inputClass}
          >
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <label className={labelClass}>
          Theme
        </label>
        <div className="flex flex-wrap gap-4">
          {['light', 'dark', 'system'].map(theme => (
            <label key={theme} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={settings.appearance.theme === theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                className="w-4 h-4 text-yellow-400 focus:ring-yellow-400"
              />
              <span className="capitalize">{theme}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className={labelClass}>
            Primary Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
              className="w-10 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={settings.appearance.primaryColor}
              onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
              className={inputClass}
              placeholder="#facc15"
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>
            Secondary Color
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="color"
              value={settings.appearance.secondaryColor}
              onChange={(e) => handleSettingChange('appearance', 'secondaryColor', e.target.value)}
              className="w-10 h-10 rounded border cursor-pointer"
            />
            <input
              type="text"
              value={settings.appearance.secondaryColor}
              onChange={(e) => handleSettingChange('appearance', 'secondaryColor', e.target.value)}
              className={inputClass}
              placeholder="#000000"
            />
          </div>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Store Logo
        </label>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
            {settings.appearance.logo ? (
              <img src={settings.appearance.logo} alt="Store logo" className="w-full h-full object-cover" />
            ) : (
              <FaStore className="text-3xl text-gray-400" />
            )}
          </div>
          <div>
            <input
              type="file"
              id="logo"
              accept="image/*"
              onChange={handleLogoUpload}
              className="hidden"
            />
            <label
              htmlFor="logo"
              className={`${buttonSecondaryClass} cursor-pointer inline-flex items-center`}
            >
              <FaUpload className="mr-2" /> Upload Logo
            </label>
            <p className="text-xs text-gray-500 mt-1">Recommended: 200x200px, Max size: 2MB</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      {[
        { key: 'emailNotifications', title: 'Email Notifications', description: 'Receive notifications via email' },
        { key: 'smsNotifications', title: 'SMS Notifications', description: 'Receive notifications via SMS' },
        { key: 'lowStockAlert', title: 'Low Stock Alerts', description: 'Get notified when products are low in stock' },
        { key: 'dailyReport', title: 'Daily Sales Report', description: 'Receive daily sales summary' },
        { key: 'weeklyReport', title: 'Weekly Sales Report', description: 'Receive weekly sales summary' },
      ].map(({ key, title, description }) => (
        <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.notifications[key]}
              onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
          </label>
        </div>
      ))}
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div>
          <h3 className="font-medium">Two-Factor Authentication</h3>
          <p className="text-sm text-gray-500">Add an extra layer of security</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.twoFactorAuth}
            onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
        </label>
      </div>

      <div>
        <label className={labelClass}>
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
          className={`${inputClass} ${errors['security.sessionTimeout'] ? 'border-red-500' : ''}`}
          min="5"
          max="480"
        />
        {errors['security.sessionTimeout'] && (
          <p className="mt-1 text-sm text-red-500">{errors['security.sessionTimeout']}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          Password Expiry (days)
        </label>
        <input
          type="number"
          value={settings.security.passwordExpiry}
          onChange={(e) => handleSettingChange('security', 'passwordExpiry', e.target.value)}
          className={`${inputClass} ${errors['security.passwordExpiry'] ? 'border-red-500' : ''}`}
          min="0"
          max="365"
        />
        <p className="text-xs text-gray-500 mt-1">Set to 0 for no expiry</p>
        {errors['security.passwordExpiry'] && (
          <p className="mt-1 text-sm text-red-500">{errors['security.passwordExpiry']}</p>
        )}
      </div>

      <div>
        <label className={labelClass}>
          Max Login Attempts
        </label>
        <input
          type="number"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', e.target.value)}
          className={`${inputClass} ${errors['security.maxLoginAttempts'] ? 'border-red-500' : ''}`}
          min="3"
          max="10"
        />
        {errors['security.maxLoginAttempts'] && (
          <p className="mt-1 text-sm text-red-500">{errors['security.maxLoginAttempts']}</p>
        )}
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Payment Methods</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3">
            <FaMoneyBill className="text-green-500 text-xl" />
            <span className="font-medium">Cash</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payment.cashEnabled}
              onChange={(e) => handleSettingChange('payment', 'cashEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
          <div className="flex items-center space-x-3">
            <FaCreditCard className="text-blue-500 text-xl" />
            <span className="font-medium">Card</span>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.payment.cardEnabled}
              onChange={(e) => handleSettingChange('payment', 'cardEnabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
          </label>
        </div>
      </div>

      <div>
        <label className={labelClass}>
          Default Payment Method
        </label>
        <select
          value={settings.payment.defaultPaymentMethod}
          onChange={(e) => handleSettingChange('payment', 'defaultPaymentMethod', e.target.value)}
          className={inputClass}
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
        <div className="flex items-center space-x-3">
          <FaReceipt className="text-gray-500 text-xl" />
          <div>
            <h3 className="font-medium">Auto-print Receipt</h3>
            <p className="text-sm text-gray-500">Automatically print receipt after sale</p>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.payment.printReceipt}
            onChange={(e) => handleSettingChange('payment', 'printReceipt', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
        </label>
      </div>
    </div>
  );

  const renderLocalizationSettings = () => (
    <div className="space-y-4">
      <div>
        <label className={labelClass}>
          Language
        </label>
        <select
          value={settings.localization.language}
          onChange={(e) => handleSettingChange('localization', 'language', e.target.value)}
          className={inputClass}
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="zh">中文</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>
          Date Format
        </label>
        <select
          value={settings.localization.dateFormat}
          onChange={(e) => handleSettingChange('localization', 'dateFormat', e.target.value)}
          className={inputClass}
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>
          Time Format
        </label>
        <select
          value={settings.localization.timeFormat}
          onChange={(e) => handleSettingChange('localization', 'timeFormat', e.target.value)}
          className={inputClass}
        >
          <option value="12h">12-hour (12:00 PM)</option>
          <option value="24h">24-hour (13:00)</option>
        </select>
      </div>

      <div>
        <label className={labelClass}>
          Number Format
        </label>
        <select
          value={settings.localization.numberFormat}
          onChange={(e) => handleSettingChange('localization', 'numberFormat', e.target.value)}
          className={inputClass}
        >
          <option value="1,234.56">1,234.56</option>
          <option value="1.234,56">1.234,56</option>
          <option value="1 234.56">1 234.56</option>
        </select>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch(activeTab) {
      case 'general':
        return renderGeneralSettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'payment':
        return renderPaymentSettings();
      case 'localization':
        return renderLocalizationSettings();
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className={`${buttonPrimaryClass} flex items-center`}
        >
          <FaSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex flex-wrap border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 md:px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-yellow-600 border-b-2 border-yellow-400'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              <tab.icon className="text-lg" />
              <span className="hidden sm:inline">{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="p-4 md:p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;