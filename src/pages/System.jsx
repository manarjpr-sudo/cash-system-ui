import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";
import FormatDate from "../components/common/FormatDate";
import Settings from "./Settings";

// ===== مكون سجل التدقيق المبسط (مع نفس تنسيق الجداول) =====
const AuditLogsSimple = () => {
    const { language } = useLanguage();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    const t = language === "ar"
        ? { title: "سجل التدقيق", loading: "جارٍ التحميل...", noData: "لا توجد سجلات" }
        : { title: "Audit Logs", loading: "Loading...", noData: "No logs found" };

    useEffect(() => {
        api.get("/audit-logs")
            .then(res => setLogs(res.data?.data || []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="text-center py-4 text-muted">{t.loading}</div>;

    return (
        <div>
            <h3 className="mb-3" style={{ color: "#0f172a" }}>{t.title}</h3>
            <div className="table-responsive">
                <table className="system-table">
                    <thead>
                        <tr>
                            <th>{language === 'ar' ? 'التاريخ' : 'Date'}</th>
                            <th>{language === 'ar' ? 'المستخدم' : 'User'}</th>
                            <th>{language === 'ar' ? 'الإجراء' : 'Action'}</th>
                            <th>{language === 'ar' ? 'الهدف' : 'Target'}</th>
                            <th>{language === 'ar' ? 'التفاصيل' : 'Details'}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.length === 0 ? (
                            <tr><td colSpan="5" className="text-center text-muted py-4">{t.noData}</td></tr>
                        ) : (
                            logs.map(log => (
                                <tr key={log.id}>
                                    <td><FormatDate value={log.created_at} /></td>
                                    <td>{log.user?.name || "-"}</td>
                                    <td><span className="badge bg-light text-dark">{log.action}</span></td>
                                    <td>{log.target_type || "-"}</td>
                                    <td>{log.description || "-"}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// ===== الصفحة الرئيسية =====
function System() {
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState("settings");

    const t = {
        ar: { 
            settings: "الإعدادات", 
            logs: "سجل التدقيق", 
            title: "صيانة النظام",
            subtitle: "إعدادات النظام وسجل الأنشطة"
        },
        en: { 
            settings: "Settings", 
            logs: "Audit Logs", 
            title: "System Maintenance",
            subtitle: "System settings and activity logs"
        },
    };
    const lang = language === "ar" ? t.ar : t.en;

    return (
        <div className="dashboard-page" style={{ padding: "24px 32px" }}>
            {/* ============================================================
                العنوان الرئيسي
            ============================================================ */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 fw-bold mb-1" style={{ color: "#0f172a" }}>{lang.title}</h1>
                    <p className="text-muted" style={{ fontSize: "14px" }}>{lang.subtitle}</p>
                </div>
            </div>

            {/* ============================================================
                التبويبات (Tabs) - نفس شكل المتصفح (Chrome)
            ============================================================ */}
            <div className="d-flex gap-1 mb-4" style={{ borderBottom: "2px solid #e9edf2" }}>
                <button
                    className={`btn btn-link text-decoration-none fw-semibold px-4 py-2 ${activeTab === "settings" ? "text-primary bg-white" : "text-secondary"}`}
                    onClick={() => setActiveTab("settings")}
                    style={{
                        border: activeTab === "settings" ? "1px solid #e9edf2" : "none",
                        borderBottom: activeTab === "settings" ? "2px solid #2563eb" : "none",
                        marginBottom: "-2px",
                        fontSize: "14px",
                        background: activeTab === "settings" ? "#ffffff" : "transparent",
                        borderRadius: "8px 8px 0 0",
                        transition: "all 0.2s ease",
                        color: activeTab === "settings" ? "#2563eb" : "#64748b",
                    }}
                >
                    {lang.settings}
                </button>
                <button
                    className={`btn btn-link text-decoration-none fw-semibold px-4 py-2 ${activeTab === "logs" ? "text-primary bg-white" : "text-secondary"}`}
                    onClick={() => setActiveTab("logs")}
                    style={{
                        border: activeTab === "logs" ? "1px solid #e9edf2" : "none",
                        borderBottom: activeTab === "logs" ? "2px solid #2563eb" : "none",
                        marginBottom: "-2px",
                        fontSize: "14px",
                        background: activeTab === "logs" ? "#ffffff" : "transparent",
                        borderRadius: "8px 8px 0 0",
                        transition: "all 0.2s ease",
                        color: activeTab === "logs" ? "#2563eb" : "#64748b",
                    }}
                >
                    {lang.logs}
                </button>
            </div>

            <div className="tab-content">
                {activeTab === "settings" && <Settings />}
                {activeTab === "logs" && <AuditLogsSimple />}
            </div>
        </div>
    );
}

export default System;