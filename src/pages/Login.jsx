import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import { authApi } from "../api/axios";
import { FaMoon, FaSun } from "react-icons/fa";

const EyeOpen = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
    </svg>
);

const EyeClosed = () => (
    <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
    >
        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
        <path d="M14.83 14.83a3 3 0 1 1-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

function Login() {
    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useContext(AuthContext);
    const { t, language } = useLanguage();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const isArabic = language === "ar";

    const text = isArabic
        ? {
              access: "تسجيل الدخول",
              accessKicker: "الوصول إلى حسابك",
              description: "أدخل بيانات حسابك للوصول إلى إدارة أموالك وعملياتك.",
              welcomeTitle: "إدارة مالية أوضح وأسهل",
              welcomeDescription:
                  "سجّل دخلك ومصروفاتك، تابع رصيدك، ونظّم عملياتك المالية في مكان واحد.",
              featureOne: "تسجيل الدخل والمصروفات",
              featureTwo: "تصنيفات رئيسية وفرعية",
              featureThree: "متابعة الرصيد والعمليات",
              signInLoading: "جارٍ تسجيل الدخول...",
              or: "أو",
              createDescription: "ليس لديك حساب؟ أنشئ حسابًا جديدًا وابدأ بإدارة عملياتك.",
              security:
                  "بيانات حسابك وعملياتك محمية من خلال تسجيل دخول آمن وصلاحيات وصول مناسبة.",
          }
        : {
              access: "Sign in",
              accessKicker: "ACCOUNT ACCESS",
              description:
                  "Enter your account details to manage your finances and operations.",
              welcomeTitle: "Simple and clear financial management",
              welcomeDescription:
                  "Track income and expenses, monitor your balance, and organize your financial operations in one place.",
              featureOne: "Record income and expenses",
              featureTwo: "Main and subcategory organization",
              featureThree: "Track balance and operations",
              signInLoading: "Signing in...",
              or: "OR",
              createDescription:
                  "Don't have an account? Create one and start managing your operations.",
              security:
                  "Your account and financial data are protected through secure authentication and access controls.",
          };

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        setError("");

        const email = form.email.trim();
        const password = form.password;

        if (!email || !password) {
            setError(
                isArabic
                    ? "يرجى إدخال البريد الإلكتروني وكلمة المرور."
                    : "Please enter your email and password."
            );
            return;
        }

        try {
            setLoading(true);

            const response = await authApi.post("/login", {
                email,
                password,
            });

            login(response.data);

            navigate("/dashboard", {
                replace: true,
            });
        } catch (requestError) {
            console.error("Login error:", requestError);

            const message = requestError.response?.data?.message;

            setError(
                message ||
                    (isArabic
                        ? "تعذر تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى."
                        : "Unable to sign in. Please check your credentials and try again.")
            );
        } finally {
            setLoading(false);
        }
    };

    const iconButtonStyle = {
        width: "36px",
        height: "36px",
        padding: 0,
        border: "1px solid #e2e8f0",
        background: "transparent",
        color: "#475569",
        borderRadius: "50%",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
    };

    return (
        <div className="auth-page">
            <div
                className="auth-language-switcher"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                }}
            >
                <LanguageSwitcher />

                <button
                    type="button"
                    onClick={toggleTheme}
                    className="btn"
                    style={iconButtonStyle}
                    title={
                        isDark
                            ? isArabic
                                ? "الوضع الفاتح"
                                : "Light mode"
                            : isArabic
                              ? "الوضع الداكن"
                              : "Dark mode"
                    }
                    aria-label={
                        isDark
                            ? isArabic
                                ? "تفعيل الوضع الفاتح"
                                : "Switch to light mode"
                            : isArabic
                              ? "تفعيل الوضع الداكن"
                              : "Switch to dark mode"
                    }
                >
                    {isDark ? <FaSun size={16} /> : <FaMoon size={16} />}
                </button>
            </div>

            <div className="auth-shell">
                <section className="auth-brand-panel">
                    <div className="auth-brand-main">
                        <div className="auth-logo">$</div>

                        <div>
                            <div className="auth-system-name">
                                {t("app.name")}
                            </div>

                            <div className="auth-system-subtitle">
                                {t("app.subtitle")}
                            </div>
                        </div>
                    </div>

                    <div className="auth-brand-content">
                        <div className="auth-eyebrow">
                            {isArabic
                                ? "إدارة مالية شخصية"
                                : "PERSONAL FINANCE MANAGEMENT"}
                        </div>

                        <h1>{text.welcomeTitle}</h1>

                        <p>{text.welcomeDescription}</p>
                    </div>

                    <div className="auth-feature-list">
                        <div className="auth-feature">
                            <span className="auth-feature-icon">✓</span>
                            <span>{text.featureOne}</span>
                        </div>

                        <div className="auth-feature">
                            <span className="auth-feature-icon">✓</span>
                            <span>{text.featureTwo}</span>
                        </div>

                        <div className="auth-feature">
                            <span className="auth-feature-icon">✓</span>
                            <span>{text.featureThree}</span>
                        </div>
                    </div>
                </section>

                <section className="auth-form-panel">
                    <div className="auth-form-header">
                        <span className="auth-form-kicker">
                            {text.accessKicker}
                        </span>

                        <h2>{text.access}</h2>

                        <p>{text.description}</p>
                    </div>

                    {error && (
                        <div
                            className="auth-alert auth-alert-error"
                            role="alert"
                        >
                            <span className="auth-alert-icon">!</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} noValidate>
                        <div className="auth-field">
                            <label htmlFor="login-email">
                                {t("auth.email")}
                            </label>

                            <input
                                id="login-email"
                                type="email"
                                value={form.email}
                                onChange={(event) =>
                                    updateField(
                                        "email",
                                        event.target.value
                                    )
                                }
                                autoComplete="email"
                                placeholder={
                                    isArabic
                                        ? "name@example.com"
                                        : "name@example.com"
                                }
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <div className="auth-field-header">
                                <label htmlFor="login-password">
                                    {t("auth.password")}
                                </label>

                                <Link to="/forgot-password">
                                    {t("auth.forgotPassword")}
                                </Link>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    border: "1px solid #ced4da",
                                    borderRadius: "4px",
                                    padding: "2px",
                                    background: "#fff",
                                }}
                            >
                                <input
                                    id="login-password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={form.password}
                                    onChange={(event) =>
                                        updateField(
                                            "password",
                                            event.target.value
                                        )
                                    }
                                    autoComplete="current-password"
                                    disabled={loading}
                                    required
                                    style={{
                                        flex: 1,
                                        border: "none",
                                        outline: "none",
                                        padding: "8px",
                                        background: "transparent",
                                        fontSize: "14px",
                                    }}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword((current) => !current)
                                    }
                                    disabled={loading}
                                    aria-label={
                                        showPassword
                                            ? isArabic
                                                ? "إخفاء كلمة المرور"
                                                : "Hide password"
                                            : isArabic
                                              ? "إظهار كلمة المرور"
                                              : "Show password"
                                    }
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: loading
                                            ? "not-allowed"
                                            : "pointer",
                                        padding: "8px 10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#6c757d",
                                    }}
                                >
                                    {showPassword ? (
                                        <EyeOpen />
                                    ) : (
                                        <EyeClosed />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="auth-button-loading">
                                    <span className="auth-spinner" />
                                    {text.signInLoading}
                                </span>
                            ) : (
                                t("auth.signIn")
                            )}
                        </button>
                    </form>

                    <div className="auth-separator">
                        <span>{text.or}</span>
                    </div>

                    <div className="auth-register-box">
                        <div>
                            <strong>{t("auth.noAccount")}</strong>
                            <span>{text.createDescription}</span>
                        </div>

                        <Link
                            to="/register"
                            className="auth-secondary-button"
                        >
                            {t("auth.createAccount")}
                        </Link>
                    </div>

                    <div className="auth-security-note">
                        <span className="auth-security-icon">✓</span>

                        <span>{text.security}</span>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default Login;