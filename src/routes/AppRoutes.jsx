import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";

import Dashboard from "../pages/Dashboard";
import Operations from "../pages/Operations";
import AdminCenter from "../pages/AdminCenter";
import System from "../pages/System";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AccessDenied from "../pages/AccessDenied";
import RegistrationPending from "../pages/RegistrationPending";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";

function AppRoutes() {
    return (
        <Routes>
            {/* صفحات المصادقة */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/registration-pending" element={<RegistrationPending />} />
            <Route path="/access-denied" element={<AccessDenied />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* الصفحات المحمية */}
            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/operations" element={<Operations />} />

                    <Route
                        path="/admin"
                        element={
                            <PermissionRoute requiredPermission="manage_users">
                                <AdminCenter />
                            </PermissionRoute>
                        }
                    />

                    <Route
                        path="/system"
                        element={
                            <PermissionRoute requiredPermission="manage_settings">
                                <System />
                            </PermissionRoute>
                        }
                    />
                </Route>
            </Route>

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
    );
}

export default AppRoutes;