import { NavLink, useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import {
    FaHome, FaClipboardList, FaUsersCog, FaCog, FaSignOutAlt,
    FaChevronLeft, FaChevronRight
} from "react-icons/fa";

function Sidebar() {
    const { user, logout } = useContext(AuthContext);
    const { language } = useLanguage();
    const navigate = useNavigate();

    const t = {
        ar: {
            dashboard: "لوحة التحكم",
            operations: "العمليات",
            admin: "الإدارة",
            system: "النظام",
            logout: "تسجيل الخروج",
            brand: "نظام إدارة النقد",
            brandSub: "إدارة مالية",
        },
        en: {
            dashboard: "Dashboard",
            operations: "Operations",
            admin: "Admin Center",
            system: "System",
            logout: "Logout",
            brand: "Cash System",
            brandSub: "Financial Management",
        },
    };
    const lang = language === "ar" ? t.ar : t.en;
    const isRTL = language === "ar";

    const [isCollapsed, setIsCollapsed] = useState(() => {
        const saved = localStorage.getItem('sidebar-collapsed');
        return saved === 'true';
    });

    useEffect(() => {
        localStorage.setItem('sidebar-collapsed', isCollapsed);
    }, [isCollapsed]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <div
            className="text-white d-flex flex-column flex-shrink-0"
            style={{
                width: isCollapsed ? "72px" : "260px",
                height: "100vh",
                position: "sticky",
                top: 0,
                background: "linear-gradient(180deg, #1e293b 0%, #0f172a 100%)",
                boxShadow: isRTL ? "-2px 0 12px rgba(0,0,0,0.15)" : "2px 0 12px rgba(0,0,0,0.15)",
                transition: "width 0.25s ease-in-out",
                overflow: "hidden",
                direction: isRTL ? "rtl" : "ltr",
            }}
        >
            {/* الشعار مع زر التبديل */}
            <div
                className="d-flex align-items-center px-3 py-3"
                style={{
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    minHeight: "72px",
                    justifyContent: isCollapsed ? "center" : "space-between",
                }}
            >
                {!isCollapsed && (
                    <div className="d-flex align-items-center gap-2">
                        <span
                            className="bg-primary rounded-2 d-flex align-items-center justify-content-center"
                            style={{ width: "36px", height: "36px", fontSize: "18px", fontWeight: "bold", flexShrink: 0 }}
                        >
                            $
                        </span>
                        <div>
                            <div className="fw-bold fs-6" style={{ fontSize: "14px" }}>{lang.brand}</div>
                            <div className="small" style={{ color: "rgba(255,255,255,0.5)", fontSize: "9px" }}>{lang.brandSub}</div>
                        </div>
                    </div>
                )}
                {isCollapsed && (
                    <span
                        className="bg-primary rounded-2 d-flex align-items-center justify-content-center"
                        style={{ width: "36px", height: "36px", fontSize: "18px", fontWeight: "bold", flexShrink: 0 }}
                    >
                        $
                    </span>
                )}
                <button
                    onClick={toggleSidebar}
                    className="btn btn-sm border-0"
                    style={{
                        padding: "4px 6px",
                        fontSize: "16px",
                        opacity: 0.7,
                        transition: "all 0.2s",
                        background: "transparent",
                        color: "#94a3b8",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#fff"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#94a3b8"}
                >
                    {isCollapsed ? (
                        isRTL ? <FaChevronLeft size={18} /> : <FaChevronRight size={18} />
                    ) : (
                        isRTL ? <FaChevronRight size={18} /> : <FaChevronLeft size={18} />
                    )}
                </button>
            </div>

            {/* الروابط مع Tooltip عند التصغير */}
            <nav className="nav nav-pills flex-column px-2 mt-3 gap-1 flex-grow-1">
                <NavLink
                    to="/dashboard"
                    title={isCollapsed ? lang.dashboard : ''}
                    className={({ isActive }) =>
                        `nav-link text-white d-flex align-items-center rounded-3 ${isActive ? "active bg-primary" : ""}`
                    }
                    style={{
                        padding: isCollapsed ? "10px 0" : "10px 14px",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: isCollapsed ? "0" : "12px",
                        fontSize: isCollapsed ? "0" : "14px",
                        transition: "all 0.2s",
                    }}
                >
                    <FaHome size={20} />
                    <span style={{
                        opacity: isCollapsed ? 0 : 1,
                        width: isCollapsed ? 0 : "auto",
                        overflow: "hidden",
                        transition: "opacity 0.2s, width 0.2s",
                        whiteSpace: "nowrap",
                    }}>
                        {lang.dashboard}
                    </span>
                </NavLink>

                <NavLink
                    to="/operations"
                    title={isCollapsed ? lang.operations : ''}
                    className={({ isActive }) =>
                        `nav-link text-white d-flex align-items-center rounded-3 ${isActive ? "active bg-primary" : ""}`
                    }
                    style={{
                        padding: isCollapsed ? "10px 0" : "10px 14px",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: isCollapsed ? "0" : "12px",
                        fontSize: isCollapsed ? "0" : "14px",
                        transition: "all 0.2s",
                    }}
                >
                    <FaClipboardList size={20} />
                    <span style={{
                        opacity: isCollapsed ? 0 : 1,
                        width: isCollapsed ? 0 : "auto",
                        overflow: "hidden",
                        transition: "opacity 0.2s, width 0.2s",
                        whiteSpace: "nowrap",
                    }}>
                        {lang.operations}
                    </span>
                </NavLink>

                <NavLink
                    to="/admin"
                    title={isCollapsed ? lang.admin : ''}
                    className={({ isActive }) =>
                        `nav-link text-white d-flex align-items-center rounded-3 ${isActive ? "active bg-primary" : ""}`
                    }
                    style={{
                        padding: isCollapsed ? "10px 0" : "10px 14px",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: isCollapsed ? "0" : "12px",
                        fontSize: isCollapsed ? "0" : "14px",
                        transition: "all 0.2s",
                    }}
                >
                    <FaUsersCog size={20} />
                    <span style={{
                        opacity: isCollapsed ? 0 : 1,
                        width: isCollapsed ? 0 : "auto",
                        overflow: "hidden",
                        transition: "opacity 0.2s, width 0.2s",
                        whiteSpace: "nowrap",
                    }}>
                        {lang.admin}
                    </span>
                </NavLink>

                <NavLink
                    to="/system"
                    title={isCollapsed ? lang.system : ''}
                    className={({ isActive }) =>
                        `nav-link text-white d-flex align-items-center rounded-3 ${isActive ? "active bg-primary" : ""}`
                    }
                    style={{
                        padding: isCollapsed ? "10px 0" : "10px 14px",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                        gap: isCollapsed ? "0" : "12px",
                        fontSize: isCollapsed ? "0" : "14px",
                        transition: "all 0.2s",
                    }}
                >
                    <FaCog size={20} />
                    <span style={{
                        opacity: isCollapsed ? 0 : 1,
                        width: isCollapsed ? 0 : "auto",
                        overflow: "hidden",
                        transition: "opacity 0.2s, width 0.2s",
                        whiteSpace: "nowrap",
                    }}>
                        {lang.system}
                    </span>
                </NavLink>
            </nav>

            {/* قسم المستخدم مع Tooltip لزر الخروج */}
            <div className="mt-auto px-2 pb-3">
                <hr className="mx-2" style={{ borderColor: "rgba(255,255,255,0.06)", opacity: 1 }} />
                <div
                    className="d-flex align-items-center gap-2 px-2 py-2"
                    style={{
                        cursor: "pointer",
                        justifyContent: isCollapsed ? "center" : "flex-start",
                    }}
                >
                    <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px", fontSize: "12px", fontWeight: "bold", flexShrink: 0 }}
                    >
                        {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                    {!isCollapsed && (
                        <div className="flex-grow-1" style={{ overflow: "hidden" }}>
                            <div className="fw-semibold small" style={{ fontSize: "12px" }}>{user?.name || "User"}</div>
                            <div className="small" style={{ color: "rgba(255,255,255,0.5)", fontSize: "10px" }}>{user?.role?.name || "No Role"}</div>
                        </div>
                    )}
                </div>
                <button
                    onClick={handleLogout}
                    title={isCollapsed ? lang.logout : ''}
                    className="btn btn-outline-danger btn-sm w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                        borderRadius: "8px",
                        padding: "6px 0",
                        fontSize: isCollapsed ? "0" : "12px",
                        transition: "all 0.2s",
                    }}
                >
                    <FaSignOutAlt size={14} />
                    <span style={{
                        opacity: isCollapsed ? 0 : 1,
                        width: isCollapsed ? 0 : "auto",
                        overflow: "hidden",
                        transition: "opacity 0.2s, width 0.2s",
                        whiteSpace: "nowrap",
                    }}>
                        {lang.logout}
                    </span>
                </button>
            </div>
        </div>
    );
}

export default Sidebar;