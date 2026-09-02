import { createContext, useState } from "react";
import axios from "axios"; // 🔥 إضافة

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const storedUser = localStorage.getItem("user");

    const [user, setUser] = useState(
        storedUser ? JSON.parse(storedUser) : null
    );

    const [token, setToken] = useState(
        localStorage.getItem("token") || null
    );

    const login = (data) => {
        const userData = {
            ...data.user,
            role: data.user?.role || null,
            permissions: data.user?.permissions || [],
        };

        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(userData));

        setToken(data.token);
        setUser(userData);
    };

    const logout = async () => {
        try {
            // 🔥 استخدم axios مباشرة مع المسار الكامل
            await axios.post("http://127.0.0.1:8000/api/logout", null, {
                headers: { Authorization: `Bearer ${token}` }
            });
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setToken(null);
            setUser(null);
        }
    };

    const hasPermission = (permission) => {
        return user?.permissions?.includes(permission) ?? false;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                logout,
                hasPermission,
                isAuthenticated: !!token,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}