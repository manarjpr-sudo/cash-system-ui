import { useContext, useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { 
    FaHome,
    FaClipboardList,
    FaUsersCog, 
    FaCog,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";

function Sidebar() {
    const { language } = useLanguage();
    const { user } = useContext(AuthContext);
    
    // ✅ تأكد من أن المدير يرى كل الروابط
    const isAdmin = user?.role?.name === 'Admin';

    const t = {
        ar: {
            dashboard: "لوحة التحكم",
            operations: "العمليات",
            admin: "الإدارة",
            system: "النظام",
            brand: "نظام إدارة النقد",
            brandSub: "إدارة مالية",
        },
        en: {
            dashboard: "Dashboard",
            operations: "Operations",
            admin: "Admin Center",
            system: "System",
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

                {/* ✅ ADMIN: يظهر دائماً للمدير */}
                {isAdmin && (
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
                )}

                {/* ✅ SYSTEM: يظهر دائماً للمدير */}
                {isAdmin && (
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
                )}
            </nav>
        </div>
    );
}

export default Sidebar;