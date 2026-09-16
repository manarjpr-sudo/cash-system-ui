import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import {
    FaMoon,
    FaSun,
    FaChevronDown,
    FaUser,
    FaSignOutAlt,
} from "react-icons/fa";
import LanguageSwitcher from "./common/LanguageSwitcher";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { language } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    const navigate = useNavigate();
    const location = useLocation();

    const [showMenu, setShowMenu] = useState(false);

    const isArabic = language === "ar";

    const t = {
        ar: {
            dashboard: "نظرة عامة",
            operations: "العمليات",
            categories: "التصنيفات",
            reports: "التقارير",
            settings: "الإعدادات",
            profile: "الملف الشخصي",
            logout: "تسجيل الخروج",
            light: "الوضع الفاتح",
            dark: "الوضع المظلم",
        },
        en: {
            dashboard: "Overview",
            operations: "Operations",
            categories: "Categories",
            reports: "Reports",
            settings: "Settings",
            profile: "Profile",
            logout: "Logout",
            light: "Light mode",
            dark: "Dark mode",
        },
    };

    const lang = isArabic ? t.ar : t.en;

    const pageTitles = {
        "/dashboard": lang.dashboard,
        "/operations": lang.operations,
        "/categories": lang.categories,
        "/reports": lang.reports,
        "/settings": lang.settings,
    };

    const pageTitle =
        pageTitles[location.pathname] ||
        lang.dashboard;

    const initial =
        user?.name?.charAt(0)?.toUpperCase() || "U";

    const handleLogout = () => {
        setShowMenu(false);
        logout();
        navigate("/login");
    };

    return (
        <header
            className="finance-navbar"
            dir={isArabic ? "rtl" : "ltr"}
        >
            <div className="finance-navbar-inner">
                <div className="finance-page-title-wrap">
                    <div className="finance-page-title">
                        {pageTitle}
                    </div>

                    <div className="finance-page-date">
                        {isArabic
                            ? "إدارة أموالك بطريقة أبسط"
                            : "Manage your money with clarity"}
                    </div>
                </div>

                <div className="finance-navbar-actions">
                    <LanguageSwitcher />

                    <button
                        type="button"
                        className="finance-navbar-icon"
                        onClick={toggleTheme}
                        title={
                            isDark
                                ? lang.light
                                : lang.dark
                        }
                    >
                        {isDark ? (
                            <FaSun size={13} />
                        ) : (
                            <FaMoon size={13} />
                        )}
                    </button>

                    <div className="finance-user-menu-wrap">
                        <button
                            type="button"
                            className="finance-user-trigger"
                            onClick={() =>
                                setShowMenu(
                                    (value) => !value
                                )
                            }
                        >
                            <span className="finance-user-avatar">
                                {initial}
                            </span>

                            <span className="finance-user-name">
                                {user?.name || "User"}
                            </span>

                            <FaChevronDown
                                size={9}
                                className={
                                    showMenu
                                        ? "rotated"
                                        : ""
                                }
                            />
                        </button>

                        {showMenu && (
                            <div
                                className={`finance-user-menu ${
                                    isArabic
                                        ? "rtl"
                                        : "ltr"
                                }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMenu(false);
                                        navigate(
                                            "/profile"
                                        );
                                    }}
                                >
                                    <FaUser size={11} />
                                    {lang.profile}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowMenu(false);
                                        navigate(
                                            "/settings"
                                        );
                                    }}
                                >
                                    {lang.settings}
                                </button>

                                <div className="finance-user-divider" />

                                <button
                                    type="button"
                                    className="logout"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt
                                        size={11}
                                    />
                                    {lang.logout}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;