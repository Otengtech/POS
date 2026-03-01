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
                    <Route path="/login" element={<Login />} />

                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/sales" element={<Sales />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/users" element={<Users />} />

                    <Route
                        path="/dashboard"
                        element={
                            <PrivateRoute>
                                <ProtectedLayout>
                                    <Dashboard />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner', 'manager', 'inventory']}>
                                <ProtectedLayout>
                                    <Products />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/sales"
                        element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner', 'manager', 'cashier']}>
                                <ProtectedLayout>
                                    <Sales />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/inventory"
                        element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner', 'manager', 'inventory']}>
                                <ProtectedLayout>
                                    <Inventory />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/reports"
                        element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner', 'manager']}>
                                <ProtectedLayout>
                                    <Reports />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/users"
                        element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner']}>
                                <ProtectedLayout>
                                    <Users />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />

                    <Route
                        path="/settings"
                        element={
                            <PrivateRoute allowedRoles={['super_admin', 'owner']}>
                                <ProtectedLayout>
                                    <Settings />
                                </ProtectedLayout>
                            </PrivateRoute>
                        }
                    />

                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </AuthProvider>
        </ErrorBoundary>
    );
}

export default App;