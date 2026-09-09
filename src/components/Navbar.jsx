import { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useSettings } from "../context/SettingsContext";
import { FaMoon, FaSun, FaSignOutAlt } from "react-icons/fa";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const { language } = useLanguage();
    const { isDark, toggleTheme } = useTheme();
    const { settings } = useSettings();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const goToAdmin = () => navigate("/admin");

    const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

    const t = {
        ar: { logout: "تسجيل خروج" },
        en: { logout: "Logout" },
    };
    const lang = language === "ar" ? t.ar : t.en;
    const isRTL = language === "ar";

    // ✅ تحديد الاسم والسلوجين حسب اللغة
    const displayName = language === 'ar' 
        ? (settings.company_name_ar || "نظام إدارة النقد")
        : (settings.company_name_en || "Cash Management System");
    
    const displaySlogan = language === 'ar'
        ? (settings.slogan_ar || "إدارة مالية ذكية")
        : (settings.slogan_en || "Smart Financial Management");

    // ✅ التأثير الزجاجي
    const glassStyle = {
        background: isDark
            ? "rgba(15, 23, 42, 0.65)"
            : "rgba(255, 255, 255, 0.55)",
        backdropFilter: "blur(20px) saturate(180%)",
        WebkitBackdropFilter: "blur(20px) saturate(180%)",
        borderBottom: isDark
            ? "1px solid rgba(255, 255, 255, 0.06)"
            : "1px solid rgba(255, 255, 255, 0.4)",
        boxShadow: isDark
            ? "0 8px 32px rgba(0, 0, 0, 0.2)"
            : "0 4px 24px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s ease",
        position: "sticky",
        top: 0,
        zIndex: 1030,
        minHeight: "64px",
        display: "flex",
        alignItems: "center",
        padding: "8px 24px",
        direction: isRTL ? "rtl" : "ltr",
        justifyContent: "space-between",
        width: "100%",
    };

    const iconButtonStyle = {
        width: "38px",
        height: "38px",
        padding: "0",
        border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(0,0,0,0.06)",
        background: isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.3)",
        transition: "all 0.2s ease",
        fontSize: "16px",
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        flexShrink: 0,
        color: isDark ? "#cbd5e1" : "#475569",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        boxShadow: "none",
    };

    const handleIconHover = (e) => {
        e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.15)";
        e.currentTarget.style.color = isDark ? "#f1f5f9" : "#0f172a";
        e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.6)";
        e.currentTarget.style.boxShadow = "none";
    };

    const handleIconLeave = (e) => {
        e.currentTarget.style.borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.06)";
        e.currentTarget.style.color = isDark ? "#cbd5e1" : "#475569";
        e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.3)";
        e.currentTarget.style.boxShadow = "none";
    };

    const logoutButtonStyle = {
        borderRadius: "8px",
        padding: "6px 14px",
        fontSize: "13px",
        whiteSpace: "nowrap",
        border: "1px solid",
        borderColor: isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)",
        color: isDark ? "#f87171" : "#ef4444",
        background: "transparent",
        transition: "all 0.2s ease",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
        boxShadow: "none",
    };

    const handleLogoutHover = (e) => {
        e.currentTarget.style.borderColor = "#ef4444";
        e.currentTarget.style.background = isDark ? "rgba(239,68,68,0.12)" : "#ef4444";
        e.currentTarget.style.color = "#ffffff";
        e.currentTarget.style.boxShadow = "none";
    };

    const handleLogoutLeave = (e) => {
        e.currentTarget.style.borderColor = isDark ? "rgba(239, 68, 68, 0.3)" : "rgba(239, 68, 68, 0.2)";
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = isDark ? "#f87171" : "#ef4444";
        e.currentTarget.style.boxShadow = "none";
    };

    const textColor = isDark ? "#f1f5f9" : "#0f172a";
    const mutedColor = isDark ? "#94a3b8" : "#94a3b8";

    return (
        <header style={glassStyle}>
            <div className="d-flex flex-column" style={{ flex: "0 1 auto", minWidth: 0 }}>
                <Link
                    to="/dashboard"
                    className="text-decoration-none fw-bold"
                    style={{
                        fontSize: "18px",
                        lineHeight: 1.2,
                        whiteSpace: "nowrap",
                        color: textColor,
                        transition: "color 0.3s ease",
                        textShadow: isDark ? "0 2px 8px rgba(0,0,0,0.2)" : "0 2px 8px rgba(255,255,255,0.1)",
                    }}
                >
                    {displayName}
                </Link>
                <span
                    className="text-muted"
                    style={{
                        fontSize: "12px",
                        marginTop: "1px",
                        whiteSpace: "nowrap",
                        color: mutedColor,
                        transition: "color 0.3s ease",
                        textShadow: isDark ? "0 2px 8px rgba(0,0,0,0.1)" : "none",
                    }}
                >
                    {displaySlogan}
                </span>
            </div>

            <div
                className="d-flex align-items-center gap-2 gap-md-3"
                style={{
                    flex: "0 0 auto",
                    marginLeft: isRTL ? "0" : "auto",
                    marginRight: isRTL ? "auto" : "0",
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <LanguageSwitcher />
                </div>

                <button
                    onClick={toggleTheme}
                    className="btn"
                    style={iconButtonStyle}
                    onMouseEnter={handleIconHover}
                    onMouseLeave={handleIconLeave}
                    title={isDark ? (language === "ar" ? "الوضع الفاتح" : "Light Mode") : (language === "ar" ? "الوضع المظلم" : "Dark Mode")}
                >
                    {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
                </button>

                <div
                    className="d-flex align-items-center gap-2"
                    style={{
                        cursor: "pointer",
                        flexShrink: 0,
                        padding: "4px 8px",
                        borderRadius: "8px",
                        transition: "background 0.2s ease",
                        background: "transparent",
                    }}
                    onClick={goToAdmin}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.03)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                    }}
                >
                    <div
                        className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                        style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "13px",
                            fontWeight: "bold",
                            flexShrink: 0,
                            boxShadow: isDark ? "0 4px 12px rgba(37,99,235,0.3)" : "0 2px 8px rgba(37,99,235,0.15)",
                        }}
                    >
                        {initial}
                    </div>
                    <div className="d-none d-md-block" style={{ minWidth: 0 }}>
                        <div
                            className="fw-semibold"
                            style={{
                                fontSize: "13px",
                                whiteSpace: "nowrap",
                                color: textColor,
                                transition: "color 0.3s ease",
                                lineHeight: 1.3,
                            }}
                        >
                            {user?.name || "User"}
                        </div>
                        <div
                            className="text-muted"
                            style={{
                                fontSize: "11px",
                                whiteSpace: "nowrap",
                                color: mutedColor,
                                transition: "color 0.3s ease",
                                lineHeight: 1.2,
                            }}
                        >
                            {user?.role?.name || "No Role"}
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="btn btn-sm d-flex align-items-center gap-1"
                    style={logoutButtonStyle}
                    onMouseEnter={handleLogoutHover}
                    onMouseLeave={handleLogoutLeave}
                >
                    <FaSignOutAlt size={14} />
                    <span className="d-none d-sm-inline">{lang.logout}</span>
                </button>
            </div>
        </header>
    );
}

export default Navbar;