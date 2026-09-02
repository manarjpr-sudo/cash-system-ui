import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

function Breadcrumb() {
    const location = useLocation();
    const { language } = useLanguage();

    const pathnames = location.pathname.split("/").filter((x) => x);

    const t = {
        ar: {
            home: "الرئيسية",
            dashboard: "لوحة التحكم",
            operations: "العمليات",
            customers: "العملاء",
            users: "المستخدمين",
            roles: "الأدوار والصلاحيات",
            settings: "الإعدادات",
        },
        en: {
            home: "Home",
            dashboard: "Dashboard",
            operations: "Operations",
            customers: "Customers",
            users: "Users",
            roles: "Roles & Permissions",
            settings: "Settings",
        },
    };

    const lang = language === "ar" ? t.ar : t.en;

    const getRouteName = (route) => lang[route] || route;

    return (
        <nav aria-label="breadcrumb" style={{
            padding: '8px 16px',
            background: 'transparent',
            borderBottom: '1px solid #e2e8f0',
            marginBottom: '16px',
            fontSize: '13px'
        }}>
            <ol className="breadcrumb" style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                <li className="breadcrumb-item">
                    <Link to="/" style={{ color: '#64748b', textDecoration: 'none' }}>{lang.home}</Link>
                </li>
                {pathnames.map((value, index) => {
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                    const isLast = index === pathnames.length - 1;
                    return (
                        <li key={to} className="breadcrumb-item" style={{ display: 'flex', alignItems: 'center' }}>
                            <span style={{ margin: '0 4px', color: '#94a3b8' }}>/</span>
                            {isLast ? (
                                <span style={{ color: '#0f172a', fontWeight: 500 }}>{getRouteName(value)}</span>
                            ) : (
                                <Link to={to} style={{ color: '#64748b', textDecoration: 'none' }}>{getRouteName(value)}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumb;