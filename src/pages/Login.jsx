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
    const { language } = useLanguage();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const isArabic = language === "ar";

    const text = isArabic
        ? {
              brandName: "إدارة أموالي",
              brandSubtitle: "مدير مالي شخصي",

              accessTitle: "مرحبًا بعودتك",
              accessDescription:
                  "سجّل دخولك لتتابع أموالك وعملياتك بسهولة.",

              welcomeTitle: "إدارة أموالك بطريقة أبسط",
              welcomeDescription:
                  "سجّل دخلك ومصروفاتك، تابع رصيدك، ونظّم عملياتك المالية في مكان واحد.",

              featureOne: "تسجيل الدخل والمصروفات",
              featureTwo: "تنظيم العمليات حسب التصنيفات",
              featureThree: "متابعة الرصيد والعمليات",

              signIn: "تسجيل الدخول",
              signInLoading: "جارٍ تسجيل الدخول...",

              email: "البريد الإلكتروني",
              emailPlaceholder: "name@example.com",

              password: "كلمة المرور",
              forgotPassword: "نسيت كلمة المرور؟",

              or: "أو",

              noAccount: "ليس لديك حساب؟",
              createDescription:
                  "أنشئ حسابك وابدأ بتنظيم أموالك بسهولة.",
              createAccount: "إنشاء حساب",

              security:
                  "بيانات حسابك وعملياتك محمية من خلال تسجيل دخول آمن.",

              emptyFields:
                  "يرجى إدخال البريد الإلكتروني وكلمة المرور.",
              loginError:
                  "تعذر تسجيل الدخول. تحقق من بياناتك وحاول مرة أخرى.",

              lightMode: "الوضع الفاتح",
              darkMode: "الوضع الداكن",
              activateLight: "تفعيل الوضع الفاتح",
              activateDark: "تفعيل الوضع الداكن",

              showPassword: "إظهار كلمة المرور",
              hidePassword: "إخفاء كلمة المرور",
          }
        : {
              brandName: "My Finances",
              brandSubtitle: "Personal Finance",

              accessTitle: "Welcome back",
              accessDescription:
                  "Sign in to keep track of your money and operations with ease.",

              welcomeTitle: "Manage your money with clarity",
              welcomeDescription:
                  "Record income and expenses, keep track of your balance, and organize your financial activity in one place.",

              featureOne: "Record income and expenses",
              featureTwo: "Organize operations by category",
              featureThree: "Keep track of your balance and activity",

              signIn: "Sign in",
              signInLoading: "Signing in...",

              email: "Email",
              emailPlaceholder: "name@example.com",

              password: "Password",
              forgotPassword: "Forgot your password?",

              or: "OR",

              noAccount: "Don't have an account?",
              createDescription:
                  "Create your account and start organizing your money with ease.",
              createAccount: "Create account",

              security:
                  "Your account and financial data are protected through secure sign-in.",

              emptyFields:
                  "Please enter your email and password.",
              loginError:
                  "Unable to sign in. Please check your details and try again.",

              lightMode: "Light mode",
              darkMode: "Dark mode",
              activateLight: "Switch to light mode",
              activateDark: "Switch to dark mode",

              showPassword: "Show password",
              hidePassword: "Hide password",
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
            setError(text.emptyFields);
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

            setError(message || text.loginError);
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
        <div className="auth-page" dir={isArabic ? "rtl" : "ltr"}>
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
                    title={isDark ? text.lightMode : text.darkMode}
                    aria-label={
                        isDark
                            ? text.activateLight
                            : text.activateDark
                    }
                >
                    {isDark ? (
                        <FaSun size={16} />
                    ) : (
                        <FaMoon size={16} />
                    )}
                </button>
            </div>

            <div className="auth-shell">
                <section className="auth-brand-panel">
                    <div className="auth-brand-main">
                        <div className="auth-logo">$</div>

                        <div>
                            <div className="auth-system-name">
                                {text.brandName}
                            </div>

                            <div className="auth-system-subtitle">
                                {text.brandSubtitle}
                            </div>
                        </div>
                    </div>

                    <div className="auth-brand-content">
                        <div className="auth-eyebrow">
                            {text.brandSubtitle}
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
                            {text.brandName}
                        </span>

                        <h2>{text.accessTitle}</h2>

                        <p>{text.accessDescription}</p>
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
                                {text.email}
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
                                placeholder={text.emailPlaceholder}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <div className="auth-field-header">
                                <label htmlFor="login-password">
                                    {text.password}
                                </label>

                                <Link to="/forgot-password">
                                    {text.forgotPassword}
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
                                        setShowPassword(
                                            (current) => !current
                                        )
                                    }
                                    disabled={loading}
                                    aria-label={
                                        showPassword
                                            ? text.hidePassword
                                            : text.showPassword
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
                                text.signIn
                            )}
                        </button>
                    </form>

                    <div className="auth-separator">
                        <span>{text.or}</span>
                    </div>

                    <div className="auth-register-box">
                        <div>
                            <strong>{text.noAccount}</strong>
                            <span>{text.createDescription}</span>
                        </div>

                        <Link
                            to="/register"
                            className="auth-secondary-button"
                        >
                            {text.createAccount}
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