import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Header';
import { FaBars, FaTimes } from 'react-icons/fa';

const ProtectedLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false); // Close mobile sidebar when resizing to desktop
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 lg:hidden animate-fade-in"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Desktop: always visible, Mobile: conditionally visible */}
      <div className={`
        fixed top-0 left-0 h-full z-40 transition-transform duration-300 ease-in-out
        ${isMobile 
          ? sidebarOpen 
            ? 'translate-x-0' 
            : '-translate-x-full' 
          : 'translate-x-0'
        }
      `}>
        <Sidebar />
      </div>

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="fixed top-4 left-4 z-50 p-3 bg-black rounded-full shadow-lg bordertransition-colors lg:hidden"
          aria-label="Toggle menu"
        >
          {sidebarOpen ? <FaTimes className="w-3 h-3 text-gray-100" /> : <FaBars className="w-3 h-3 text-gray-100" />}
        </button>
      )}

      {/* Main Content */}
      <div className={`
        transition-all duration-300
        ${isMobile ? 'ml-0' : 'ml-64'}
      `}>
        <Navbar 
          isMobile={isMobile} 
          sidebarOpen={sidebarOpen}
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        
        <main className={`
          transition-all duration-300
          ${isMobile ? 'pt-16 px-4' : 'pt-20 px-6'}
          pb-6 animate-fade-in
        `}>
          <div className="max-w-7xl mx-auto mt-8 md:mt-0">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;