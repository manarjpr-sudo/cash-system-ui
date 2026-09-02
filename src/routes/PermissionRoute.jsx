import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

function PermissionRoute({ permission, children }) {

    const { hasPermission } = useContext(AuthContext);

    if (!hasPermission(permission)) {

        return (
            <Navigate
                to="/access-denied"
                replace
            />
        );

    }

    return children;
}

export default PermissionRoute;
