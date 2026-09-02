import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun, FaBell } from 'react-icons/fa';
import notificationService from "../services/notificationService";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { language, changeLanguage } = useLanguage();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const count = await notificationService.getUnreadCount();
                setUnreadCount(count);
            } catch (error) {
                console.error("Error fetching unread count:", error);
            }
        };
        fetchUnreadCount();
        const interval = setInterval(fetchUnreadCount, 30000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleLanguage = () => {
        changeLanguage(language === "en" ? "ar" : "en");
    };

    const goToProfile = () => navigate("/profile");
    const goToNotifications = () => navigate("/notifications");

    const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

    const t = {
        ar: { title: "نظام إدارة النقد", subtitle: "العمليات المالية", logout: "تسجيل خروج", changeLang: "English" },
        en: { title: "Cash Management System", subtitle: "Financial Operations", logout: "Logout", changeLang: "عربي" },
    };

    const lang = language === "ar" ? t.ar : t.en;

    return (
        <header className="navbar navbar-expand bg-white border-bottom px-4 py-2 flex-shrink-0">
            <div className="d-flex align-items-center">
                <span className="fw-bold fs-6">{lang.title}</span>
                <span className="text-secondary small ms-2">{lang.subtitle}</span>
            </div>
            <div className="d-flex align-items-center ms-auto gap-3">
                <button onClick={toggleTheme} className="btn btn-outline-secondary btn-sm d-flex align-items-center gap-1">
                    {isDark ? <FaSun /> : <FaMoon />}
                </button>
                <button onClick={toggleLanguage} className="btn btn-outline-secondary btn-sm">
                    {lang.changeLang}
                </button>
                <button onClick={goToNotifications} className="btn btn-outline-secondary btn-sm position-relative">
                    <FaBell />
                    {unreadCount > 0 && (
                        <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
                            {unreadCount > 99 ? "99+" : unreadCount}
                        </span>
                    )}
                </button>
                <div className="d-flex align-items-center gap-2" style={{ cursor: "pointer" }} onClick={goToProfile}>
                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", fontSize: "14px", fontWeight: "bold" }}>
                        {initial}
                    </div>
                    <div className="d-none d-sm-block">
                        <div className="fw-semibold small">{user?.name || "User"}</div>
                        <div className="text-secondary small">{user?.role?.name || "No Role"}</div>
                    </div>
                </div>
                <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
                    {lang.logout}
                </button>
            </div>
        </header>
    );
}
export default Navbar;