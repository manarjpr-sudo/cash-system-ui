import { useEffect, useState, useContext } from "react";
import { useLanguage } from "../context/LanguageContext";
import api from "../api/axios";
import { toast } from "react-toastify";
import { AuthContext } from "../context/AuthContext";

function Settings() {
    const { language } = useLanguage();
    const { user } = useContext(AuthContext);
    const [activeTab, setActiveTab] = useState("general"); // general, financial, account

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [backupLoading, setBackupLoading] = useState(false);
    
    // الإعدادات العامة
    const [settings, setSettings] = useState({
        company_name: "",
        company_email: "",
        currency_symbol: "$",
        date_format: "dd/mm/yyyy",
        timezone: "Asia/Riyadh",
        default_language: "ar",
    });

    // الملف الشخصي (كلمة المرور والاسم)
    const [profile, setProfile] = useState({
        name: user?.name || "",
        email: user?.email || "",
        current_password: "",
        new_password: "",
        new_password_confirmation: "",
    });

    const t = {
        ar: {
            title: "الإعدادات والحساب",
            subtitle: "إدارة النظام وحسابك الشخصي",
            tabs: { general: "عام", financial: "مالي", account: "حسابي" },
            company: "معلومات المنشأة",
            companyName: "اسم الشركة",
            companyNamePlaceholder: "أدخل اسم الشركة",
            companyEmail: "البريد الإلكتروني للدعم",
            companyEmailPlaceholder: "support@example.com",
            financial: "الإعدادات المالية",
            currency: "رمز العملة",
            currencyPlaceholder: "مثل: $, ريال",
            currencyHelp: "سيظهر بجانب المبالغ",
            dateFormat: "تنسيق التاريخ",
            general: "عام",
            timezone: "المنطقة الزمنية",
            languageLabel: "اللغة الافتراضية",
            arabic: "العربية",
            english: "الإنجليزية",
            security: "الأمان",
            backup: "نسخ احتياطي",
            backupDesc: "نسخة كاملة من قاعدة البيانات",
            backupConfirm: "إنشاء نسخة احتياطية الآن؟",
            backupSuccess: "تم الإنشاء بنجاح",
            backupError: "فشل الإنشاء",
            save: "حفظ",
            saving: "جارٍ الحفظ...",
            loading: "جارٍ التحميل...",
            success: "تم الحفظ بنجاح",
            error: "حدث خطأ",
            account: "حسابي",
            name: "الاسم",
            email: "البريد الإلكتروني",
            currentPassword: "كلمة المرور الحالية",
            newPassword: "كلمة المرور الجديدة",
            confirmPassword: "تأكيد كلمة المرور",
            updateProfile: "تحديث الحساب",
            changePassword: "تغيير كلمة المرور",
        },
        en: {
            title: "Settings & Account",
            subtitle: "Manage system and personal settings",
            tabs: { general: "General", financial: "Financial", account: "Account" },
            company: "Company Info",
            companyName: "Company Name",
            companyNamePlaceholder: "Enter company name",
            companyEmail: "Support Email",
            companyEmailPlaceholder: "support@example.com",
            financial: "Financial Settings",
            currency: "Currency Symbol",
            currencyPlaceholder: "e.g. $, €",
            currencyHelp: "Appears next to amounts",
            dateFormat: "Date Format",
            general: "General",
            timezone: "Time Zone",
            languageLabel: "Default Language",
            arabic: "Arabic",
            english: "English",
            security: "Security",
            backup: "Backup",
            backupDesc: "Full database backup",
            backupConfirm: "Create backup now?",
            backupSuccess: "Backup created",
            backupError: "Backup failed",
            save: "Save",
            saving: "Saving...",
            loading: "Loading...",
            success: "Saved successfully",
            error: "An error occurred",
            account: "My Account",
            name: "Name",
            email: "Email",
            currentPassword: "Current Password",
            newPassword: "New Password",
            confirmPassword: "Confirm Password",
            updateProfile: "Update Account",
            changePassword: "Change Password",
        },
    };

    const lang = language === "ar" ? t.ar : t.en;
    const dateFormats = [
        { value: "dd/mm/yyyy", label: "dd/mm/yyyy (25/08/2026)" },
        { value: "mm/dd/yyyy", label: "mm/dd/yyyy (08/25/2026)" },
        { value: "yyyy/mm/dd", label: "yyyy/mm/dd (2026/08/25)" },
        { value: "dd-mm-yyyy", label: "dd-mm-yyyy (25-08-2026)" },
        { value: "mm-dd-yyyy", label: "mm-dd-yyyy (08-25-2026)" },
        { value: "yyyy-mm-dd", label: "yyyy-mm-dd (2026-08-25)" },
        { value: "dd.mm.yyyy", label: "dd.mm.yyyy (25.08.2026)" },
        { value: "mm.dd.yyyy", label: "mm.dd.yyyy (08.25.2026)" },
        { value: "yyyy.mm.dd", label: "yyyy.mm.dd (2026.08.25)" },
    ];

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        try {
            const response = await api.get("/settings");
            const data = response.data || {};
            setSettings({
                company_name: data.company_name || "",
                company_email: data.company_email || "",
                currency_symbol: data.currency_symbol || "$",
                date_format: data.date_format || "dd/mm/yyyy",
                timezone: data.timezone || "Asia/Riyadh",
                default_language: data.default_language || "ar",
            });
        } catch (error) {
            console.error("Error loading settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({ ...prev, [name]: value }));
    };

    const handleProfileChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({ ...prev, [name]: value }));
    };

    const handleSaveSettings = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/settings", settings);
            toast.success(lang.success);
        } catch (error) {
            console.error(error);
            toast.error(lang.error);
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/profile", { name: profile.name, email: profile.email });
            toast.success(lang.success);
            // تحديث localStorage
            const updatedUser = { ...user, name: profile.name, email: profile.email };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            window.location.reload();
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || lang.error);
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.put("/profile/password", {
                current_password: profile.current_password,
                new_password: profile.new_password,
                new_password_confirmation: profile.new_password_confirmation,
            });
            toast.success(lang.success);
            setProfile(prev => ({ ...prev, current_password: "", new_password: "", new_password_confirmation: "" }));
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || lang.error);
        } finally {
            setSaving(false);
        }
    };

    const handleBackup = async () => {
        if (!window.confirm(lang.backupConfirm)) return;
        setBackupLoading(true);
        try {
            await api.post("/backup");
            toast.success(lang.backupSuccess);
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || lang.backupError);
        } finally {
            setBackupLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <div className="text-center py-5">
                    <div className="spinner-border text-primary" role="status" />
                    <p className="mt-2">{lang.loading}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>{lang.title}</h2>
                    <p className="text-muted">{lang.subtitle}</p>
                </div>
                <span className="badge bg-secondary">v2.0</span>
            </div>

            {/* Tabs */}
            <ul className="nav nav-tabs mb-4">
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "general" ? "active" : ""}`} onClick={() => setActiveTab("general")}>
                        {lang.tabs.general}
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "financial" ? "active" : ""}`} onClick={() => setActiveTab("financial")}>
                        {lang.tabs.financial}
                    </button>
                </li>
                <li className="nav-item">
                    <button className={`nav-link ${activeTab === "account" ? "active" : ""}`} onClick={() => setActiveTab("account")}>
                        {lang.tabs.account}
                    </button>
                </li>
            </ul>

            {/* Tab Content */}
            <div className="tab-content">
                {/* 1. General */}
                {activeTab === "general" && (
                    <form onSubmit={handleSaveSettings}>
                        <div className="card p-4">
                            <h5 className="mb-3"><span className="me-2">🏢</span> {lang.company}</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">{lang.companyName}</label>
                                    <input type="text" className="form-control" name="company_name" value={settings.company_name} onChange={handleSettingsChange} placeholder={lang.companyNamePlaceholder} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">{lang.companyEmail}</label>
                                    <input type="email" className="form-control" name="company_email" value={settings.company_email} onChange={handleSettingsChange} placeholder={lang.companyEmailPlaceholder} />
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">{lang.timezone}</label>
                                    <select className="form-select" name="timezone" value={settings.timezone} onChange={handleSettingsChange}>
                                        <option value="Asia/Riyadh">Asia/Riyadh (UTC+3)</option>
                                        <option value="Asia/Dubai">Asia/Dubai (UTC+4)</option>
                                        <option value="Europe/London">Europe/London (UTC+0)</option>
                                        <option value="America/New_York">America/New_York (UTC-4)</option>
                                        <option value="UTC">UTC</option>
                                    </select>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">{lang.languageLabel}</label>
                                    <select className="form-select" name="default_language" value={settings.default_language} onChange={handleSettingsChange}>
                                        <option value="ar">{lang.arabic}</option>
                                        <option value="en">{lang.english}</option>
                                    </select>
                                </div>
                            </div>
                            <div className="mt-4 d-flex justify-content-end gap-2">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? <><span className="spinner-border spinner-border-sm me-2" />{lang.saving}</> : lang.save}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* 2. Financial */}
                {activeTab === "financial" && (
                    <form onSubmit={handleSaveSettings}>
                        <div className="card p-4">
                            <h5 className="mb-3"><span className="me-2">💰</span> {lang.financial}</h5>
                            <div className="row g-3">
                                <div className="col-md-6">
                                    <label className="form-label">{lang.currency}</label>
                                    <div className="d-flex align-items-center gap-2">
                                        <input type="text" className="form-control" name="currency_symbol" value={settings.currency_symbol} onChange={handleSettingsChange} placeholder={lang.currencyPlaceholder} style={{ maxWidth: '150px' }} />
                                        <span className="text-muted" style={{ fontSize: '11px' }}>{lang.currencyHelp}</span>
                                    </div>
                                    <div className="mt-2 p-2 bg-light rounded text-center"><strong>{settings.currency_symbol} 1,000.00</strong></div>
                                </div>
                                <div className="col-md-6">
                                    <label className="form-label">{lang.dateFormat}</label>
                                    <select className="form-select" name="date_format" value={settings.date_format} onChange={handleSettingsChange}>
                                        {dateFormats.map((f) => (<option key={f.value} value={f.value}>{f.label}</option>))}
                                    </select>
                                </div>
                                <div className="col-12">
                                    <hr />
                                    <h6>{lang.security}</h6>
                                    <p className="text-muted" style={{ fontSize: '12px' }}>{lang.backupDesc}</p>
                                    <button type="button" className="btn btn-warning" onClick={handleBackup} disabled={backupLoading}>
                                        {backupLoading ? <><span className="spinner-border spinner-border-sm me-2" />{lang.saving}</> : <>💾 {lang.backup}</>}
                                    </button>
                                </div>
                            </div>
                            <div className="mt-4 d-flex justify-content-end gap-2">
                                <button type="submit" className="btn btn-primary" disabled={saving}>
                                    {saving ? <><span className="spinner-border spinner-border-sm me-2" />{lang.saving}</> : lang.save}
                                </button>
                            </div>
                        </div>
                    </form>
                )}

                {/* 3. Account (Profile) */}
                {activeTab === "account" && (
                    <div className="row g-4">
                        <div className="col-md-6">
                            <div className="card p-4">
                                <h5 className="mb-3">👤 {lang.account}</h5>
                                <form onSubmit={handleUpdateProfile}>
                                    <div className="mb-3">
                                        <label className="form-label">{lang.name}</label>
                                        <input type="text" className="form-control" name="name" value={profile.name} onChange={handleProfileChange} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{lang.email}</label>
                                        <input type="email" className="form-control" name="email" value={profile.email} onChange={handleProfileChange} />
                                    </div>
                                    <button type="submit" className="btn btn-primary" disabled={saving}>
                                        {saving ? <><span className="spinner-border spinner-border-sm me-2" />{lang.saving}</> : lang.updateProfile}
                                    </button>
                                </form>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="card p-4">
                                <h5 className="mb-3">🔒 {lang.changePassword}</h5>
                                <form onSubmit={handleChangePassword}>
                                    <div className="mb-3">
                                        <label className="form-label">{lang.currentPassword}</label>
                                        <input type="password" className="form-control" name="current_password" value={profile.current_password} onChange={handleProfileChange} required />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{lang.newPassword}</label>
                                        <input type="password" className="form-control" name="new_password" value={profile.new_password} onChange={handleProfileChange} required minLength={8} />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">{lang.confirmPassword}</label>
                                        <input type="password" className="form-control" name="new_password_confirmation" value={profile.new_password_confirmation} onChange={handleProfileChange} required />
                                    </div>
                                    <button type="submit" className="btn btn-warning" disabled={saving}>
                                        {saving ? <><span className="spinner-border spinner-border-sm me-2" />{lang.saving}</> : lang.changePassword}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Settings;