import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
    FaHome,
    FaExchangeAlt,
    FaTags,
    FaChartPie,
    FaCog,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

function Sidebar() {
    const { language } = useLanguage();
    const { user } = useContext(AuthContext);

    const isRTL = language === "ar";

    const t = {
        ar: {
            home: "الرئيسية",
            operations: "العمليات",
            categories: "التصنيفات",
            reports: "التقارير",
            settings: "الإعدادات",
            brand: "إدارة أموالي",
            subtitle: "مدير مالي شخصي",
            menu: "القائمة",
        },
        en: {
            home: "Home",
            operations: "Operations",
            categories: "Categories",
            reports: "Reports",
            settings: "Settings",
            brand: "My Finances",
            subtitle: "Personal Finance",
            menu: "Menu",
        },
    };

    const lang = isRTL ? t.ar : t.en;

    const items = [
        {
            to: "/dashboard",
            label: lang.home,
            icon: FaHome,
        },
        {
            to: "/operations",
            label: lang.operations,
            icon: FaExchangeAlt,
        },
        {
            to: "/categories",
            label: lang.categories,
            icon: FaTags,
        },
        {
            to: "/reports",
            label: lang.reports,
            icon: FaChartPie,
        },
    ];

    return (
        <aside
            className="finance-sidebar"
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="finance-sidebar-brand">
                <NavLink
                    to="/dashboard"
                    className="finance-brand"
                >
                    <span className="finance-brand-mark">
                        <span />
                        <span />
                        <span />
                    </span>

                    <span className="finance-brand-copy">
                        <strong>{lang.brand}</strong>
                        <small>{lang.subtitle}</small>
                    </span>
                </NavLink>

                <button
                    type="button"
                    className="finance-sidebar-toggle"
                    aria-label={lang.menu}
                >
                    {isRTL ? (
                        <FaChevronRight size={10} />
                    ) : (
                        <FaChevronLeft size={10} />
                    )}
                </button>
            </div>

            <div className="finance-sidebar-section-title">
                {lang.menu}
            </div>

            <nav className="finance-sidebar-nav">
                {items.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                            `finance-nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="finance-nav-icon">
                            <Icon size={14} />
                        </span>

                        <span className="finance-nav-label">
                            {label}
                        </span>

                        <span className="finance-nav-active-dot" />
                    </NavLink>
                ))}
            </nav>

            <div className="finance-sidebar-spacer" />

            <div className="finance-sidebar-user">
                <div className="finance-sidebar-avatar">
                    {user?.name
                        ?.charAt(0)
                        ?.toUpperCase() || "U"}
                </div>

                <div className="finance-sidebar-user-text">
                    <strong>
                        {user?.name || "User"}
                    </strong>

                    <span>
                        {isRTL
                            ? "حساب شخصي"
                            : "Personal account"}
                    </span>
                </div>
            </div>

            <NavLink
                to="/settings"
                className={({ isActive }) =>
                    `finance-settings-link ${
                        isActive ? "active" : ""
                    }`
                }
            >
                <FaCog size={13} />
                <span>{lang.settings}</span>
            </NavLink>
        </aside>
    );
}

export default Sidebar;