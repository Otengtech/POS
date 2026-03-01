import React, { useState } from 'react';
import { 
  FaStore, FaPalette, FaBell, FaLock, 
  FaLanguage, FaSave, FaUpload, FaGlobe,
  FaCreditCard, FaTruck, FaReceipt
} from 'react-icons/fa';
import { toast } from 'react-hot-toast';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [loading, setLoading] = useState(false);

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

  const handleSettingChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
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
      // Handle file upload
      console.log('Uploading:', file);
      toast.success('Logo uploaded successfully');
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Name
          </label>
          <input
            type="text"
            value={settings.general.storeName}
            onChange={(e) => handleSettingChange('general', 'storeName', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Email
          </label>
          <input
            type="email"
            value={settings.general.storeEmail}
            onChange={(e) => handleSettingChange('general', 'storeEmail', e.target.value)}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Store Phone
          </label>
          <input
            type="tel"
            value={settings.general.storePhone}
            onChange={(e) => handleSettingChange('general', 'storePhone', e.target.value)}
            className="input-field"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tax Rate (%)
          </label>
          <input
            type="number"
            value={settings.general.taxRate}
            onChange={(e) => handleSettingChange('general', 'taxRate', e.target.value)}
            className="input-field"
            min="0"
            max="100"
            step="0.1"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Address
        </label>
        <textarea
          value={settings.general.address}
          onChange={(e) => handleSettingChange('general', 'address', e.target.value)}
          rows="3"
          className="input-field"
        ></textarea>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Currency
          </label>
          <select
            value={settings.general.currency}
            onChange={(e) => handleSettingChange('general', 'currency', e.target.value)}
            className="input-field"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Timezone
          </label>
          <select
            value={settings.general.timezone}
            onChange={(e) => handleSettingChange('general', 'timezone', e.target.value)}
            className="input-field"
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Theme
        </label>
        <div className="flex space-x-4">
          {['light', 'dark', 'system'].map(theme => (
            <label key={theme} className="flex items-center space-x-2">
              <input
                type="radio"
                name="theme"
                value={theme}
                checked={settings.appearance.theme === theme}
                onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
                className="text-yellow-400 focus:ring-yellow-400"
              />
              <span className="capitalize">{theme}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="input-field flex-1"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
              className="input-field flex-1"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Store Logo
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
            <FaStore className="text-3xl text-gray-400" />
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
              className="btn-secondary cursor-pointer flex items-center"
            >
              <FaUpload className="mr-2" /> Upload Logo
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium">Email Notifications</h3>
          <p className="text-sm text-gray-500">Receive notifications via email</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium">SMS Notifications</h3>
          <p className="text-sm text-gray-500">Receive notifications via SMS</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.smsNotifications}
            onChange={(e) => handleSettingChange('notifications', 'smsNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium">Low Stock Alerts</h3>
          <p className="text-sm text-gray-500">Get notified when products are low in stock</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.lowStockAlert}
            onChange={(e) => handleSettingChange('notifications', 'lowStockAlert', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
        </label>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div>
          <h3 className="font-medium">Daily Sales Report</h3>
          <p className="text-sm text-gray-500">Receive daily sales summary</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.dailyReport}
            onChange={(e) => handleSettingChange('notifications', 'dailyReport', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-400"></div>
        </label>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session Timeout (minutes)
        </label>
        <input
          type="number"
          value={settings.security.sessionTimeout}
          onChange={(e) => handleSettingChange('security', 'sessionTimeout', e.target.value)}
          className="input-field"
          min="5"
          max="480"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Password Expiry (days)
        </label>
        <input
          type="number"
          value={settings.security.passwordExpiry}
          onChange={(e) => handleSettingChange('security', 'passwordExpiry', e.target.value)}
          className="input-field"
          min="0"
          max="365"
        />
        <p className="text-xs text-gray-500 mt-1">Set to 0 for no expiry</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Max Login Attempts
        </label>
        <input
          type="number"
          value={settings.security.maxLoginAttempts}
          onChange={(e) => handleSettingChange('security', 'maxLoginAttempts', e.target.value)}
          className="input-field"
          min="3"
          max="10"
        />
      </div>
    </div>
  );

  const renderPaymentSettings = () => (
    <div className="space-y-4">
      <h3 className="font-medium mb-2">Payment Methods</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <FaMoneyBill className="text-green-500" />
            <span>Cash</span>
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

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <FaCreditCard className="text-blue-500" />
            <span>Card</span>
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Default Payment Method
        </label>
        <select
          value={settings.payment.defaultPaymentMethod}
          onChange={(e) => handleSettingChange('payment', 'defaultPaymentMethod', e.target.value)}
          className="input-field"
        >
          <option value="cash">Cash</option>
          <option value="card">Card</option>
        </select>
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <FaReceipt className="text-gray-500" />
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
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Language
        </label>
        <select
          value={settings.localization.language}
          onChange={(e) => handleSettingChange('localization', 'language', e.target.value)}
          className="input-field"
        >
          <option value="en">English</option>
          <option value="es">Español</option>
          <option value="fr">Français</option>
          <option value="de">Deutsch</option>
          <option value="zh">中文</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Date Format
        </label>
        <select
          value={settings.localization.dateFormat}
          onChange={(e) => handleSettingChange('localization', 'dateFormat', e.target.value)}
          className="input-field"
        >
          <option value="MM/DD/YYYY">MM/DD/YYYY</option>
          <option value="DD/MM/YYYY">DD/MM/YYYY</option>
          <option value="YYYY-MM-DD">YYYY-MM-DD</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Time Format
        </label>
        <select
          value={settings.localization.timeFormat}
          onChange={(e) => handleSettingChange('localization', 'timeFormat', e.target.value)}
          className="input-field"
        >
          <option value="12h">12-hour (12:00 PM)</option>
          <option value="24h">24-hour (13:00)</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number Format
        </label>
        <select
          value={settings.localization.numberFormat}
          onChange={(e) => handleSettingChange('localization', 'numberFormat', e.target.value)}
          className="input-field"
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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
        <button
          onClick={handleSave}
          disabled={loading}
          className="btn-primary flex items-center"
        >
          <FaSave className="mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium transition-colors relative ${
                activeTab === tab.id
                  ? 'text-yellow-600 border-b-2 border-yellow-400'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <tab.icon />
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default Settings;