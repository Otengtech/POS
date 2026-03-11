import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close mobile sidebar when resizing to desktop
  useEffect(() => {
    if (!isMobile && sidebarOpen) {
      setSidebarOpen(false);
    }
  }, [isMobile, sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {isMobile && (
        <div
          className={`fixed inset-0 z-50 transition-opacity duration-300 ${
            sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
          }`}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          
          {/* Sidebar drawer */}
          <div
            className={`absolute inset-y-0 left-0 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-out ${
              sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <Sidebar mobile onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Desktop sidebar - fixed */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-72">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="min-h-screen md:pl-72 flex flex-col">
        {/* Header */}
        <Header setSidebarOpen={setSidebarOpen} />
        
        {/* Page content */}
        <main className="flex-1 bg-gray-50">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;