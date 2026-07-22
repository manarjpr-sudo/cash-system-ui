import { Routes, Route, Navigate } from "react-router-dom";

import Layout from "../components/Layout";
import ProtectedRoute from "./ProtectedRoute";
import PermissionRoute from "./PermissionRoute";


import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
import Customers from "../pages/Customers";
import Transactions from "../pages/Transactions";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import Login from "../pages/Login";
import AuditLogs from "../pages/AuditLogs";
import AccessDenied from "../pages/AccessDenied";



function AppRoutes() {


    return (

        <Routes>



            <Route
                path="/login"
                element={<Login />}
            />





            <Route element={<ProtectedRoute />}>


                <Route element={<Layout />}>


                    <Route
                        path="/dashboard"
                        element={<Dashboard />}
                    />



                    <Route
                        path="/orders"
                        element={<Orders />}
                    />



                    <Route
                        path="/customers"
                        element={<Customers />}
                    />



                    <Route
                        path="/transactions"
                        element={<Transactions />}
                    />



                    <Route
                        path="/users"
                        element={
                            <PermissionRoute permission="View_Users">
                                <Users />
                            </PermissionRoute>
                        }
                    />



                    <Route
                        path="/settings"
                        element={
                            <PermissionRoute permission="Manage_Settings">
                                <Settings />
                            </PermissionRoute>
                        }
                    />



                    <Route
                        path="/auditlogs"
                        element={
                            <PermissionRoute permission="View_AuditLogs">
                                <AuditLogs />
                            </PermissionRoute>
                        }
                    />



                </Route>


            </Route>





            <Route
                path="/access-denied"
                element={<AccessDenied />}
            />





            <Route
                path="*"
                element={
                    <Navigate
                        to="/dashboard"
                        replace
                    />
                }
            />



        </Routes>

    );

}



export default AppRoutes;