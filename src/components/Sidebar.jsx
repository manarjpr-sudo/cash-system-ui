import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
    FaHome,
    FaExchangeAlt,
    FaChartPie,
    FaCog,
    FaChevronLeft,
    FaChevronRight,
} from "react-icons/fa";

function Sidebar({ isCollapsed, onToggle }) {
    const { language } = useLanguage();
    const { user } = useContext(AuthContext);

    const isRTL = language === "ar";

    const t = {
        ar: {
            home: "الرئيسية",
            operations: "العمليات",
            reports: "التقارير",
            settings: "الإعدادات",
            brand: "إدارة أموالي",
            subtitle: "مدير مالي شخصي",
            menu: "القائمة",
            expand: "توسيع القائمة",
            collapse: "تصغير القائمة",
        },
        en: {
            home: "Home",
            operations: "Operations",
            reports: "Reports",
            settings: "Settings",
            brand: "My Finances",
            subtitle: "Personal Finance",
            menu: "Menu",
            expand: "Expand menu",
            collapse: "Collapse menu",
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
            to: "/reports",
            label: lang.reports,
            icon: FaChartPie,
        },
    ];

    return (
        <aside
            className={`finance-sidebar ${
                isCollapsed ? "collapsed" : ""
            }`}
            dir={isRTL ? "rtl" : "ltr"}
        >
            <div className="finance-sidebar-brand">
                <NavLink
                    to="/dashboard"
                    className="finance-brand"
                    title={isCollapsed ? lang.brand : undefined}
                >
                    <span className="finance-brand-mark">$</span>

                    {!isCollapsed && (
                        <span className="finance-brand-copy">
                            <strong>{lang.brand}</strong>
                            <small>{lang.subtitle}</small>
                        </span>
                    )}
                </NavLink>

                <button
                    type="button"
                    className="finance-sidebar-toggle"
                    onClick={onToggle}
                    aria-label={
                        isCollapsed
                            ? lang.expand
                            : lang.collapse
                    }
                    title={
                        isCollapsed
                            ? lang.expand
                            : lang.collapse
                    }
                >
                    {isRTL ? (
                        isCollapsed ? (
                            <FaChevronLeft size={10} />
                        ) : (
                            <FaChevronRight size={10} />
                        )
                    ) : isCollapsed ? (
                        <FaChevronRight size={10} />
                    ) : (
                        <FaChevronLeft size={10} />
                    )}
                </button>
            </div>

            {!isCollapsed && (
                <div className="finance-sidebar-section-title">
                    {lang.menu}
                </div>
            )}

            <nav className="finance-sidebar-nav">
                {items.map(({ to, label, icon: Icon }) => (
                    <NavLink
                        key={to}
                        to={to}
                        title={isCollapsed ? label : undefined}
                        className={({ isActive }) =>
                            `finance-nav-link ${
                                isActive ? "active" : ""
                            }`
                        }
                    >
                        <span className="finance-nav-icon">
                            <Icon size={14} />
                        </span>

                        {!isCollapsed && (
                            <span className="finance-nav-label">
                                {label}
                            </span>
                        )}

                        {!isCollapsed && (
                            <span className="finance-nav-active-dot" />
                        )}
                    </NavLink>
                ))}
            </nav>

            <div className="finance-sidebar-spacer" />

            {!isCollapsed && (
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
            )}

            <NavLink
                to="/settings"
                title={isCollapsed ? lang.settings : undefined}
                className={({ isActive }) =>
                    `finance-settings-link ${
                        isActive ? "active" : ""
                    }`
                }
            >
                <FaCog size={13} />

                {!isCollapsed && (
                    <span>{lang.settings}</span>
                )}
            </NavLink>
        </aside>
    );
}

export default Sidebar;