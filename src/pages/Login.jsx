import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

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

function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const { t, language, changeLanguage } = useLanguage();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/login", form);
            login(response.data);
            navigate("/dashboard", { replace: true });
        } catch (error) {
            console.error("Login error:", error);
            setError(
                error.response?.data?.message ||
                "Unable to sign in. Please check your credentials."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (newLanguage) => {
        changeLanguage(newLanguage);
    };

    return (
        <div className="auth-page">
            <div className="auth-language-switcher">
                <button
                    type="button"
                    className={language === "ar" ? "language-button active" : "language-button"}
                    onClick={() => handleLanguageChange("ar")}
                >
                    العربية
                </button>
                <span className="language-divider">/</span>
                <button
                    type="button"
                    className={language === "en" ? "language-button active" : "language-button"}
                    onClick={() => handleLanguageChange("en")}
                >
                    English
                </button>
            </div>

            <div className="auth-shell">
                <section className="auth-brand-panel">
                    <div className="auth-brand-main">
                        <div className="auth-logo">$</div>
                        <div>
                            <div className="auth-system-name">{t("app.name")}</div>
                            <div className="auth-system-subtitle">{t("app.subtitle")}</div>
                        </div>
                    </div>
                    <div className="auth-brand-content">
                        <div className="auth-eyebrow">FINANCIAL OPERATIONS PLATFORM</div>
                        <h1>
                            {language === "ar"
                                ? "إدارة مالية أكثر وضوحًا وتحكمًا وأمانًا."
                                : "Clearer, controlled and secure financial operations."}
                        </h1>
                        <p>
                            {language === "ar"
                                ? "منصة موحدة لإدارة العمليات النقدية، الموافقات، المعاملات، المستخدمين والتقارير ضمن بيئة آمنة وقابلة للتدقيق."
                                : "A unified platform for managing cash operations, approvals, transactions, users and reporting within a secure and auditable environment."}
                        </p>
                    </div>
                    <div className="auth-feature-list">
                        <div className="auth-feature">
                            <span className="auth-feature-icon">✓</span>
                            <span>{language === "ar" ? "صلاحيات وتحكم مركزي" : "Centralized access control"}</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-icon">✓</span>
                            <span>{language === "ar" ? "دورة موافقات للعمليات والحسابات" : "Approval workflows for operations and accounts"}</span>
                        </div>
                        <div className="auth-feature">
                            <span className="auth-feature-icon">✓</span>
                            <span>{language === "ar" ? "سجل تدقيق ومتابعة للأنشطة" : "Audit trail and activity tracking"}</span>
                        </div>
                    </div>
                </section>

                <section className="auth-form-panel">
                    <div className="auth-form-header">
                        <span className="auth-form-kicker">
                            {language === "ar" ? "بوابة الدخول" : "SECURE ACCESS"}
                        </span>
                        <h2>{t("auth.login")}</h2>
                        <p>
                            {language === "ar"
                                ? "أدخل بيانات حسابك للوصول إلى النظام."
                                : "Enter your account credentials to access the system."}
                        </p>
                    </div>

                    {error && (
                        <div className="auth-alert auth-alert-error" role="alert">
                            <span className="auth-alert-icon">!</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin}>
                        <div className="auth-field">
                            <label htmlFor="login-email">{t("auth.email")}</label>
                            <input
                                id="login-email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                autoComplete="email"
                                placeholder="name@example.com"
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="auth-field">
                            <div className="auth-field-header">
                                <label htmlFor="login-password">{t("auth.password")}</label>
                                <Link to="/forgot-password">{t("auth.forgotPassword")}</Link>
                            </div>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                border: '1px solid #ced4da',
                                borderRadius: '4px',
                                padding: '2px',
                                background: '#fff',
                                transition: 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out'
                            }}>
                                <input
                                    id="login-password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    autoComplete="current-password"
                                    required
                                    disabled={loading}
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
                                    {/* 🔥 التعديل هنا: افتراضي مغلق، عند الضغط مفتوح */}
                                    {showPassword ? <EyeOpen /> : <EyeClosed />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? (
                                <span className="auth-button-loading">
                                    <span className="auth-spinner" />
                                    {language === "ar" ? "جارٍ تسجيل الدخول..." : "Signing in..."}
                                </span>
                            ) : (
                                t("auth.signIn")
                            )}
                        </button>
                    </form>

                    <div className="auth-separator"><span>{language === "ar" ? "أو" : "OR"}</span></div>

                    <div className="auth-register-box">
                        <div>
                            <strong>{t("auth.noAccount")}</strong>
                            <span>{language === "ar" ? "يمكنك تقديم طلب إنشاء حساب جديد." : "Submit a request to create a new account."}</span>
                        </div>
                        <Link to="/register" className="auth-secondary-button">{t("auth.createAccount")}</Link>
                    </div>

                    <div className="auth-security-note">
                        <span className="auth-security-icon">🔒</span>
                        <span>
                            {language === "ar"
                                ? "الوصول إلى النظام خاضع للصلاحيات والموافقات الإدارية."
                                : "System access is governed by roles, permissions and administrator approval."}
                        </span>
                    </div>
                </section>
            </div>

            <div className="auth-footer-note">
                © {new Date().getFullYear()} Cash Management System
            </div>
        </div>
    );
}

export default Login;