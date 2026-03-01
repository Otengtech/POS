import React from 'react';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const ProtectedLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Sidebar />
      <div className="ml-64 transition-all duration-300">
        <Navbar />
        <main className="pt-20 px-6 pb-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ProtectedLayout;