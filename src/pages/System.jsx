import { useState, useEffect, useContext } from "react";
import { useLanguage } from "../context/LanguageContext";
import { AuthContext } from "../context/AuthContext";
import { useSettings } from "../context/SettingsContext";
import { toast } from "react-toastify";
import Select from 'react-select';
import { CURRENCIES } from "../constants/currencies";
import { TIMEZONES } from "../constants/timezones";

// ============================================================
// أنماط react-select الموحدة للوضع المظلم
// ============================================================
const selectStyles = {
    control: (base) => ({
        ...base,
        background: "var(--bg-input)",
        borderColor: "var(--border-color)",
        color: "var(--text-primary)",
        minHeight: "38px",
        borderRadius: "8px",
        boxShadow: "none",
        '&:hover': {
            borderColor: "var(--color-primary)",
        },
    }),
    menu: (base) => ({
        ...base,
        background: "var(--bg-card)",
        border: "1px solid var(--border-color)",
        borderRadius: "8px",
        maxHeight: "300px",
        overflow: "auto",
        boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
    }),
    option: (base, state) => ({
        ...base,
        background: state.isFocused ? "var(--hover-bg)" : "var(--bg-card)",
        color: "var(--text-primary)",
        cursor: "pointer",
        '&:active': {
            background: "var(--color-primary)",
            color: "#fff",
        },
    }),
    singleValue: (base) => ({
        ...base,
        color: "var(--text-primary)",
    }),
    input: (base) => ({
        ...base,
        color: "var(--text-primary)",
    }),
    placeholder: (base) => ({
        ...base,
        color: "var(--text-muted)",
    }),
    dropdownIndicator: (base) => ({
        ...base,
        color: "var(--text-muted)",
        '&:hover': {
            color: "var(--text-primary)",
        },
    }),
    clearIndicator: (base) => ({
        ...base,
        color: "var(--text-muted)",
        '&:hover': {
            color: "var(--text-primary)",
        },
    }),
    noOptionsMessage: (base) => ({
        ...base,
        color: "var(--text-muted)",
    }),
};

// ============================================================
// مكون الإعدادات المتكامل (يستخدم SettingsContext)
// ============================================================
const SettingsPanel = () => {
    const { language } = useLanguage();
    const { user, hasPermission } = useContext(AuthContext);
    const { settings, updateSettings, loading: settingsLoading } = useSettings();
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        if (settings) {
            setFormData(settings);
        }
    }, [settings]);

    const t = {
        ar: {
            title: "الإعدادات العامة",
            subtitle: "تخصيص إعدادات النظام الأساسية",
            companyNameAr: "اسم النظام (عربي)",
            companyNameEn: "اسم النظام (English)",
            sloganAr: "النص الوصفي (عربي)",
            sloganEn: "النص الوصفي (English)",
            currency: "العملة الأساسية",
            dateFormat: "تنسيق التاريخ",
            timezone: "المنطقة الزمنية",
            autoApprove: "الموافقة التلقائية على العمليات",
            itemsPerPage: "عدد العناصر لكل صفحة",
            save: "حفظ الإعدادات",
            saving: "جارٍ الحفظ...",
            loading: "جارٍ التحميل...",
            success: "تم حفظ الإعدادات بنجاح",
            error: "فشل حفظ الإعدادات",
            noPermission: "ليس لديك صلاحية لتعديل الإعدادات",
            maxLengthName: "الحد الأقصى 50 حرفاً",
            maxLengthSlogan: "الحد الأقصى 30 حرفاً",
            showCurrencySymbol: "إظهار رمز العملة",
        },
        en: {
            title: "General Settings",
            subtitle: "Customize core system settings",
            companyNameAr: "System Name (Arabic)",
            companyNameEn: "System Name (English)",
            sloganAr: "Tagline (Arabic)",
            sloganEn: "Tagline (English)",
            currency: "Base Currency",
            dateFormat: "Date Format",
            timezone: "Timezone",
            autoApprove: "Auto-approve operations",
            itemsPerPage: "Items per page",
            save: "Save Settings",
            saving: "Saving...",
            loading: "Loading...",
            success: "Settings saved successfully",
            error: "Failed to save settings",
            noPermission: "You don't have permission to edit settings",
            maxLengthName: "Maximum 50 characters",
            maxLengthSlogan: "Maximum 30 characters",
            showCurrencySymbol: "Show currency symbol",
        },
    };
    const lang = language === "ar" ? t.ar : t.en;

    const isAdmin = hasPermission("manage_settings") || user?.role?.name === "Admin";

    // تحويل قائمة العملات إلى شكل مناسب لـ react-select
    const currencyOptions = CURRENCIES.map(cur => ({
        value: cur.code,
        label: language === 'ar' 
            ? `${cur.name_ar} (${cur.symbol_ar})` 
            : `${cur.name_en} (${cur.symbol_en})`
    }));

    // تحويل قائمة المناطق الزمنية إلى شكل مناسب لـ react-select
    const timezoneOptions = TIMEZONES.map(tz => ({
        value: tz.value,
        label: language === 'ar' ? tz.label_ar : tz.label_en,
    }));

    const selectedCurrency = currencyOptions.find(opt => opt.value === formData.currency);
    const selectedTimezone = timezoneOptions.find(opt => opt.value === formData.timezone);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'company_name_ar' || name === 'company_name_en') {
            const maxLen = 50;
            if (value.length > maxLen) {
                toast.warning(lang.maxLengthName);
                return;
            }
        }

        if (name === 'slogan_ar' || name === 'slogan_en') {
            const maxLen = 30;
            if (value.length > maxLen) {
                toast.warning(lang.maxLengthSlogan);
                return;
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isAdmin) {
            toast.error(lang.noPermission);
            return;
        }

        setSaving(true);
        try {
            const success = await updateSettings(formData);
            if (success) {
                toast.success(lang.success);
            } else {
                toast.error(lang.error);
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || lang.error);
        } finally {
            setSaving(false);
        }
    };

    if (settingsLoading) {
        return <div className="text-center py-4 text-muted">{lang.loading}</div>;
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="card p-4 mb-4" style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: "var(--radius-card)" }}>
                <h4 className="mb-3" style={{ color: "var(--text-primary)" }}>{lang.title}</h4>
                <p className="text-muted mb-4">{lang.subtitle}</p>

                <div className="row g-3">
                    {/* اسم النظام (عربي) */}
                    <div className="col-md-6">
                        <label className="form-label">{lang.companyNameAr}</label>
                        <input
                            type="text"
                            className="form-control"
                            name="company_name_ar"
                            value={formData.company_name_ar || ""}
                            onChange={handleChange}
                            disabled={!isAdmin || saving}
                            placeholder={lang.companyNameAr}
                            maxLength={50}
                        />
                        <small className="text-muted">{lang.maxLengthName}</small>
                    </div>

                    {/* اسم النظام (إنجليزي) */}
                    <div className="col-md-6">
                        <label className="form-label">{lang.companyNameEn}</label>
                        <input
                            type="text"
                            className="form-control"
                            name="company_name_en"
                            value={formData.company_name_en || ""}
                            onChange={handleChange}
                            disabled={!isAdmin || saving}
                            placeholder={lang.companyNameEn}
                            maxLength={50}
                        />
                        <small className="text-muted">{lang.maxLengthName}</small>
                    </div>

                    {/* النص الوصفي (عربي) */}
                    <div className="col-md-6">
                        <label className="form-label">{lang.sloganAr}</label>
                        <input
                            type="text"
                            className="form-control"
                            name="slogan_ar"
                            value={formData.slogan_ar || ""}
                            onChange={handleChange}
                            disabled={!isAdmin || saving}
                            placeholder={lang.sloganAr}
                            maxLength={30}
                        />
                        <small className="text-muted">{lang.maxLengthSlogan}</small>
                    </div>

                    {/* النص الوصفي (إنجليزي) */}
                    <div className="col-md-6">
                        <label className="form-label">{lang.sloganEn}</label>
                        <input
                            type="text"
                            className="form-control"
                            name="slogan_en"
                            value={formData.slogan_en || ""}
                            onChange={handleChange}
                            disabled={!isAdmin || saving}
                            placeholder={lang.sloganEn}
                            maxLength={30}
                        />
                        <small className="text-muted">{lang.maxLengthSlogan}</small>
                    </div>

                    {/* العملة الأساسية */}
                    <div className="col-md-6">
                        <label className="form-label">{lang.currency}</label>
                        <Select
                            options={currencyOptions}
                            value={selectedCurrency}
                            onChange={(selected) => {
                                setFormData(prev => ({
                                    ...prev,
                                    currency: selected ? selected.value : '',
                                }));
                            }}
                            isDisabled={!isAdmin || saving}
                            placeholder={language === 'ar' ? 'ابحث عن العملة...' : 'Search currency...'}
                            isSearchable={true}
                            styles={selectStyles}
                        />
                    </div>

                    {/* إظهار رمز العملة */}
                    <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check mt-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="show_currency_symbol"
                                id="show_currency_symbol"
                                checked={formData.show_currency_symbol !== undefined ? formData.show_currency_symbol : true}
                                onChange={handleChange}
                                disabled={!isAdmin || saving}
                            />
                            <label className="form-check-label" htmlFor="show_currency_symbol">
                                {lang.showCurrencySymbol}
                            </label>
                        </div>
                    </div>

                    {/* المنطقة الزمنية */}
                    <div className="col-md-6">
                        <label className="form-label">{lang.timezone}</label>
                        <Select
                            options={timezoneOptions}
                            value={selectedTimezone}
                            onChange={(selected) => {
                                setFormData(prev => ({
                                    ...prev,
                                    timezone: selected ? selected.value : "UTC",
                                }));
                            }}
                            isDisabled={!isAdmin || saving}
                            placeholder={language === 'ar' ? 'ابحث عن المنطقة الزمنية...' : 'Search timezone...'}
                            isSearchable={true}
                            styles={selectStyles}
                        />
                    </div>

                    {/* تنسيق التاريخ */}
                    <div className="col-md-4">
                        <label className="form-label">{lang.dateFormat}</label>
                        <select
                            className="form-select"
                            name="date_format"
                            value={formData.date_format || "YYYY-MM-DD"}
                            onChange={handleChange}
                            disabled={!isAdmin || saving}
                        >
                            <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                            <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                            <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                            <option value="DD-MM-YYYY">DD-MM-YYYY</option>
                        </select>
                    </div>

                    {/* عدد العناصر لكل صفحة */}
                    <div className="col-md-4">
                        <label className="form-label">{lang.itemsPerPage}</label>
                        <select
                            className="form-select"
                            name="items_per_page"
                            value={formData.items_per_page || 10}
                            onChange={handleChange}
                            disabled={!isAdmin || saving}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>

                    {/* الموافقة التلقائية */}
                    <div className="col-12">
                        <div className="form-check">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                name="auto_approve"
                                id="auto_approve"
                                checked={formData.auto_approve || false}
                                onChange={handleChange}
                                disabled={!isAdmin || saving}
                            />
                            <label className="form-check-label" htmlFor="auto_approve">
                                {lang.autoApprove}
                            </label>
                        </div>
                    </div>
                </div>

                {isAdmin && (
                    <div className="mt-4 d-flex gap-2">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                            {saving ? lang.saving : lang.save}
                        </button>
                    </div>
                )}

                {!isAdmin && (
                    <div className="mt-3 text-warning">
                        <small>{lang.noPermission}</small>
                    </div>
                )}
            </div>
        </form>
    );
};

// ============================================================
// الصفحة الرئيسية System
// ============================================================
function System() {
    const { language } = useLanguage();

    const t = {
        ar: {
            title: "إعدادات النظام",
            subtitle: "تخصيص إعدادات النظام الأساسية"
        },
        en: {
            title: "System Settings",
            subtitle: "Customize core system settings"
        },
    };
    const lang = language === "ar" ? t.ar : t.en;

    return (
        <div className="dashboard-page" style={{ padding: "24px 32px" }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h1 className="h2 fw-bold mb-1" style={{ color: "var(--text-primary)" }}>{lang.title}</h1>
                    <p className="text-muted" style={{ fontSize: "14px" }}>{lang.subtitle}</p>
                </div>
            </div>

            <div className="tab-content">
                <SettingsPanel />
            </div>
        </div>
    );
}

export default System;