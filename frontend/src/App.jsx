import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './auth/PrivateRoute';
import ProtectedLayout from './components/layout/ProtectedLayout';
import Login from './auth/Login';
import Dashboard from './pos/Dashboard';
import Products from './pos/Products';
import Sales from './pos/Sales';
import Inventory from './pos/Inventory';
import Reports from './pos/Reports';
import Users from './pos/Users';
import Settings from './pos/Settings';
import Toast from './common/Toast';
import ErrorBoundary from './common/ErrorBandary';

function App() {
    return (
        <ErrorBoundary>
            <AuthProvider>
                <Toast />
                <Routes>
                    {/* Public route */}
                    <Route path="/login" element={<Login />} />

                    {/* Protected routes - all wrapped in PrivateRoute with ProtectedLayout */}
                    <Route path="/" element={
                        <PrivateRoute>
                            <ProtectedLayout />
                        </PrivateRoute>
                    }>
                        {/* Nested routes will render inside ProtectedLayout's children */}
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="products" element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner', 'manager', 'inventory']}>
                                <Products />
                            </PrivateRoute>
                        } />
                        <Route path="sales" element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner', 'manager', 'cashier']}>
                                <Sales />
                            </PrivateRoute>
                        } />
                        <Route path="inventory" element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner', 'manager', 'inventory']}>
                                <Inventory />
                            </PrivateRoute>
                        } />
                        <Route path="reports" element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner', 'manager']}>
                                <Reports />
                            </PrivateRoute>
                        } />
                        <Route path="users" element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner']}>
                                <Users />
                            </PrivateRoute>
                        } />
                        <Route path="settings" element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner']}>
                                <Settings />
                            </PrivateRoute>
                        } />
                    </Route>

                    {/* Redirect any unknown routes to dashboard */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;