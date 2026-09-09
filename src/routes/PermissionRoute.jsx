import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PermissionRoute({ requiredPermission, children }) {
    const { user, hasPermission } = useContext(AuthContext);

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // ✅ السماح للمدير بكل شيء
    if (user?.role?.name === 'Admin') {
        return children || <Outlet />;
    }

    if (!hasPermission(requiredPermission)) {
        return <Navigate to="/access-denied" replace />;
    }

    return children || <Outlet />;
}

export default PermissionRoute;