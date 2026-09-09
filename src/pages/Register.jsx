import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";
import LanguageSwitcher from "../components/common/LanguageSwitcher";

// SVG Icons
const EyeOpen = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
        <circle cx="12" cy="12" r="3"/>
    </svg>
);

const EyeClosed = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
        <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
);

function Register() {
    const [roles, setRoles] = useState([]);
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        requested_role_id: "",
    });
    const [loadingRoles, setLoadingRoles] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const { t, language } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    useEffect(() => {
        loadRoles();
    }, []);

    const loadRoles = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/registration-roles");
            setRoles(response.data);
        } catch (error) {
            console.error(error);
            setError(
                error.response?.data?.message ||
                "Unable to load available account types."
            );
        } finally {
            setLoadingRoles(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/register", form);
            setSuccess(
                response.data?.message ||
                (language === "ar"
                    ? "تم إرسال طلب التسجيل بنجاح."
                    : "Registration submitted successfully.")
            );
            setTimeout(() => {
                navigate("/registration-pending");
            }, 900);
        } catch (error) {
            console.error(error);
            const validationErrors = error.response?.data?.errors;
            if (validationErrors) {
                const firstError = Object.values(validationErrors).flat().at(0);
                setError(firstError || "Registration failed.");
            } else {
                setError(
                    error.response?.data?.message ||
                    (language === "ar"
                        ? "تعذر إرسال طلب التسجيل."
                        : "Registration failed.")
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const iconButtonStyle = {
        width: '36px',
        height: '36px',
        padding: '0',
        border: '1px solid #e2e8f0',
        background: 'transparent',
        color: '#475569',
        transition: 'all 0.2s ease',
        fontSize: '16px',
        boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
        borderRadius: '50%',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
    };

    const iconButtonHover = {
        borderColor: '#94a3b8',
        color: '#0f172a',
        background: '#f8fafc',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
    };

    return (
        <div className="min-h-screen d-flex flex-column align-items-center justify-content-center" style={{ background: '#f4f6f9', padding: '30px' }}>
            {/* شريط اللغة والوضع الليلي */}
            <div className="w-100 d-flex justify-content-end px-3" style={{ maxWidth: '1080px', marginBottom: '20px', gap: '10px' }}>
                <LanguageSwitcher />
                <button
                    onClick={toggleTheme}
                    className="btn"
                    style={iconButtonStyle}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, iconButtonHover)}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#e2e8f0';
                        e.currentTarget.style.color = '#475569';
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.02)';
                    }}
                    title={isDark ? (language === 'ar' ? 'الوضع الفاتح' : 'Light Mode') : (language === 'ar' ? 'الوضع المظلم' : 'Dark Mode')}
                >
                    {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
                </button>
            </div>

            {/* بطاقة التسجيل */}
            <div className="auth-shell" style={{ maxWidth: '1080px', width: '100%' }}>
                <section className="auth-brand-panel">
                    <div className="auth-brand-main">
                        <div className="auth-logo">$</div>
                        <div>
                            <div className="auth-system-name">{t("app.name")}</div>
                            <div className="auth-system-subtitle">{t("app.subtitle")}</div>
                        </div>
                    </div>
                    <div className="auth-brand-content">
                        <div className="auth-eyebrow">
                            {language === "ar" ? "طلب إنشاء حساب" : "ACCOUNT REGISTRATION"}
                        </div>
                        <h1>
                            {language === "ar"
                                ? "أنشئ حسابك وابدأ من خلال بيئة مالية منظمة وآمنة."
                                : "Create your account and join a controlled financial environment."}
                        </h1>
                        <p>
                            {language === "ar"
                                ? "كل طلب تسجيل يخضع لمراجعة مدير النظام قبل تفعيل الحساب ومنح الصلاحيات."
                                : "Every registration request is reviewed by an administrator before the account is activated and permissions are assigned."}
                        </p>
                    </div>
                    <div className="auth-feature-list">
                        <div className="auth-feature">
                            <span className="auth-feature-icon">✓</span>
                            <span>{language === "ar" ? "اختيار نوع الحساب" : "Choose an account type"}</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-icon">✓</span>
                            <span>{language === "ar" ? "مراجعة إدارية قبل التفعيل" : "Administrator review before activation"}</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-icon">✓</span>
                            <span>{language === "ar" ? "الصلاحيات تحدد وفق الدور المعتمد" : "Permissions follow the approved role"}</span>
                        </div>
                    </div>
                </section>

                <section className="auth-form-panel">
                    <div className="auth-form-header">
                        <span className="auth-form-kicker">
                            {language === "ar" ? "تسجيل مستخدم جديد" : "NEW ACCOUNT"}
                        </span>
                        <h2>{t("auth.createYourAccount")}</h2>
                        <p>
                            {language === "ar"
                                ? "أرسل طلبك وسيتم مراجعته من مدير النظام."
                                : "Submit your request for administrator review."}
                        </p>
                    </div>

                    {error && (
                        <div className="auth-alert auth-alert-error" role="alert">
                            <span className="auth-alert-icon">!</span>
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="auth-alert auth-alert-success" role="status">
                            {success}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="register-name">{t("auth.fullName")}</label>
                            <input
                                id="register-name"
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                                autoComplete="name"
                                disabled={submitting}
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-email">{t("auth.email")}</label>
                            <input
                                id="register-email"
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                required
                                autoComplete="email"
                                disabled={submitting}
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-role">{t("auth.accountType")}</label>
                            <select
                                id="register-role"
                                name="requested_role_id"
                                value={form.requested_role_id}
                                onChange={handleChange}
                                required
                                disabled={loadingRoles || submitting}
                            >
                                <option value="">
                                    {loadingRoles
                                        ? (language === "ar" ? "جارٍ تحميل أنواع الحساب..." : "Loading account types...")
                                        : (language === "ar" ? "اختر نوع الحساب" : "Select account type")}
                                </option>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>
                                        {role.name}
                                    </option>
                                ))}
                            </select>
                            <small>
                                {language === "ar"
                                    ? "نوع الحساب الذي تختاره هو طلب فقط، وسيحدد المدير الدور النهائي."
                                    : "This is only a requested role. The administrator assigns the final role."}
                            </small>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-password">{t("auth.password")}</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                padding: '2px',
                                background: '#fff',
                                transition: 'border-color 0.15s ease-in-out'
                            }}>
                                <input
                                    id="register-password"
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    disabled={submitting}
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        padding: '8px',
                                        background: 'transparent',
                                        fontSize: '14px'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px 10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#6c757d',
                                        transition: 'color 0.2s'
                                    }}
                                    tabIndex="-1"
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#343a40'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                                >
                                    {showPassword ? <EyeOpen /> : <EyeClosed />}
                                </button>
                            </div>
                            <small style={{ display: 'block', marginTop: '4px', color: '#6c757d' }}>
                                {language === "ar"
                                    ? "يجب أن تحتوي على 8 أحرف على الأقل، حرف كبير، حرف صغير، ورقم."
                                    : "Must contain at least 8 characters, one uppercase, one lowercase, and one number."}
                            </small>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-confirm-password">{t("auth.confirmPassword")}</label>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                padding: '2px',
                                background: '#fff',
                                transition: 'border-color 0.15s ease-in-out'
                            }}>
                                <input
                                    id="register-confirm-password"
                                    type={showConfirm ? "text" : "password"}
                                    name="password_confirmation"
                                    value={form.password_confirmation}
                                    onChange={handleChange}
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                    disabled={submitting}
                                    style={{
                                        flex: 1,
                                        border: 'none',
                                        outline: 'none',
                                        padding: '8px',
                                        background: 'transparent',
                                        fontSize: '14px'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirm(!showConfirm)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '8px 10px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: '#6c757d',
                                        transition: 'color 0.2s'
                                    }}
                                    tabIndex="-1"
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#343a40'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#6c757d'}
                                >
                                    {showConfirm ? <EyeOpen /> : <EyeClosed />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={submitting || loadingRoles}
                        >
                            {submitting
                                ? (language === "ar" ? "جارٍ إرسال الطلب..." : "Submitting...")
                                : t("auth.createAccount")}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>{t("auth.haveAccount")}</span>{" "}
                        <Link to="/login">{t("auth.signIn")}</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Register;