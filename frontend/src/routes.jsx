import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layout - Critical path, load immediately
import Layout from './components/Layout/Layout';

// Critical components - load immediately
import Loader from './common/Loader';
import Dashboard from './page/Dashboard/Dashboard';

// Lazy load non-critical components with meaningful chunk names
const Login = lazy(() => import(/* webpackChunkName: "auth" */ './auth/Login'));
const SuperAdminSetup = lazy(() => import(/* webpackChunkName: "auth" */ './auth/SuperAdminSetup'));

// Admin components - lazy load
const AdminList = lazy(() => import(/* webpackChunkName: "admin" */ './page/Admins/AdminList'));
const CreateAdmin = lazy(() => import(/* webpackChunkName: "admin" */ './page/Admins/CreateAdmin'));
const EditAdmin = lazy(() => import(/* webpackChunkName: "admin" */ './page/Admins/EditAdmin'));
const AdminDetails = lazy(() => import(/* webpackChunkName: "admin" */ './page/Admins/AdminDetails'));

// Business components - lazy load
const BusinessList = lazy(() => import(/* webpackChunkName: "business" */ './components/Businesses/BusinessList'));
const CreateBusiness = lazy(() => import(/* webpackChunkName: "business" */ './components/Businesses/CreateBusiness'));
const EditBusiness = lazy(() => import(/* webpackChunkName: "business" */ './components/Businesses/EditBusiness'));
const BusinessDetails = lazy(() => import(/* webpackChunkName: "business" */ './components/Businesses/BusinessDetails'));

// Branch components - lazy load
const BranchList = lazy(() => import(/* webpackChunkName: "branch" */ './components/Branches/BranchList'));
const CreateBranch = lazy(() => import(/* webpackChunkName: "branch" */ './components/Branches/CreateBranch'));
const EditBranch = lazy(() => import(/* webpackChunkName: "branch" */ './components/Branches/EditBranch'));
const BranchDetails = lazy(() => import(/* webpackChunkName: "branch" */ './components/Branches/BranchDetails'));

// Product components - lazy load
const ProductList = lazy(() => import(/* webpackChunkName: "product" */ './page/Products/ProductList'));
const CreateProduct = lazy(() => import(/* webpackChunkName: "product" */ './page/Products/CreateProduct'));
const EditProduct = lazy(() => import(/* webpackChunkName: "product" */ './page/Products/EditProduct'));
const ProductDetails = lazy(() => import(/* webpackChunkName: "product" */ './page/Products/ProductDetails'));

// Sales components - lazy load
const SaleList = lazy(() => import(/* webpackChunkName: "sales" */ './page/Sales/SaleList'));
const CreateSale = lazy(() => import(/* webpackChunkName: "sales" */ './page/Sales/CreateSale'));
const SaleDetails = lazy(() => import(/* webpackChunkName: "sales" */ './page/Sales/SaleDetails'));

// Inventory components - lazy load
const InventoryList = lazy(() => import(/* webpackChunkName: "inventory" */ './page/Inventory/InventoryList'));
const StockAdjustment = lazy(() => import(/* webpackChunkName: "inventory" */ './page/Inventory/StockAdjustment'));
const StockMovements = lazy(() => import(/* webpackChunkName: "inventory" */ './page/Inventory/StockMovements'));

// Reports & Settings - lazy load
const Reports = lazy(() => import(/* webpackChunkName: "reports" */ './page/Reports/Reports'));
const Profile = lazy(() => import(/* webpackChunkName: "settings" */ './page/Settings/Profile'));

// Simple fallback loader for lazy components
const LazyLoader = () => <Loader size="small" text="Loading..." />;

const PrivateRoute = ({ children, allowedRoles = [] }) => {
    const { isAuthenticated, hasRole, loading } = useAuth();

    if (loading) {
        return <Loader text="Authenticating..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.some(role => hasRole(role))) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

// Optimize role checks to prevent unnecessary re-renders
const AppRoutes = () => {
    return (
        <Suspense fallback={<Loader text="Loading application..." />}>
            <Routes>
                {/* Public routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/setup-super-admin" element={<SuperAdminSetup />} />

                {/* Protected routes */}
                <Route path="/" element={
                    <PrivateRoute>
                        <Layout />
                    </PrivateRoute>
                }>
                    <Route index element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Dashboard - Critical, load normally */}
                    <Route path="dashboard" element={<Dashboard />} />

                    {/* Admin Routes - Super Admin only */}
                    <Route path="admins">
                        <Route index element={
                            <PrivateRoute allowedRoles={['super_admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <AdminList />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path="create" element={
                            <PrivateRoute allowedRoles={['super_admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <CreateAdmin />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path=":id" element={
                            <PrivateRoute allowedRoles={['super_admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <AdminDetails />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path=":id/edit" element={
                            <PrivateRoute allowedRoles={['super_admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <EditAdmin />
                                </Suspense>
                            </PrivateRoute>
                        } />
                    </Route>

                    {/* Inventory Routes */}
                    <Route path="inventory">
                        <Route index element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <InventoryList />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path="movements" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <StockMovements />
                                </Suspense>
                            </PrivateRoute>
                        } />
                    </Route>

                    <Route path="products/:id/adjust-stock" element={
                        <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                            <Suspense fallback={<LazyLoader />}>
                                <StockAdjustment />
                            </Suspense>
                        </PrivateRoute>
                    } />

                    {/* Business Routes */}
                    <Route path="businesses">
                        <Route index element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <BusinessList />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path="create" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <CreateBusiness />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path=":id" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <BusinessDetails />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path=":id/edit" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <EditBusiness />
                                </Suspense>
                            </PrivateRoute>
                        } />
                    </Route>

                    {/* Branch Routes */}
                    <Route path="branches">
                        <Route index element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <BranchList />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path="create" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <CreateBranch />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path=":id" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <BranchDetails />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path=":id/edit" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <EditBranch />
                                </Suspense>
                            </PrivateRoute>
                        } />
                    </Route>

                    {/* Product Routes */}
                    <Route path="products">
                        <Route index element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <ProductList />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path="create" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <CreateProduct />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path=":id" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <ProductDetails />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path=":id/edit" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <EditProduct />
                                </Suspense>
                            </PrivateRoute>
                        } />
                    </Route>

                    {/* Sales Routes */}
                    <Route path="sales">
                        <Route index element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <SaleList />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path="create" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <CreateSale />
                                </Suspense>
                            </PrivateRoute>
                        } />
                        <Route path=":id" element={
                            <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                                <Suspense fallback={<LazyLoader />}>
                                    <SaleDetails />
                                </Suspense>
                            </PrivateRoute>
                        } />
                    </Route>

                    {/* Reports Routes */}
                    <Route path="reports" element={
                        <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                            <Suspense fallback={<LazyLoader />}>
                                <Reports />
                            </Suspense>
                        </PrivateRoute>
                    } />

                    {/* Settings Routes */}
                    <Route path="settings" element={
                        <PrivateRoute allowedRoles={['super_admin', 'admin']}>
                            <Suspense fallback={<LazyLoader />}>
                                <Profile />
                            </Suspense>
                        </PrivateRoute>
                    } />
                </Route>
            </Routes>
        </Suspense>
    );
};

export default React.memo(AppRoutes);