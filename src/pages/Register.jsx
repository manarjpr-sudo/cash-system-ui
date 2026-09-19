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

function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const { login } = useContext(AuthContext);
    const { language } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    const isArabic = language === "ar";

    const text = isArabic
        ? {
              brandName: "إدارة أموالي",
              brandSubtitle: "مدير مالي شخصي",

              formKicker: "إنشاء حساب",
              title: "ابدأ من هنا",
              description:
                  "أنشئ حسابك وابدأ بتنظيم أموالك وعملياتك المالية بسهولة.",

              welcomeKicker: "مدير مالي شخصي",
              welcomeTitle: "رتّب أموالك بطريقة أبسط",
              welcomeDescription:
                  "سجّل دخلك ومصروفاتك، نظّم عملياتك حسب التصنيفات، وتابع رصيدك في مكان واحد.",

              featureOne: "تسجيل الدخل والمصروفات",
              featureTwo: "تنظيم العمليات حسب التصنيف",
              featureThree: "متابعة الرصيد والعمليات",

              name: "الاسم",
              email: "البريد الإلكتروني",
              password: "كلمة المرور",
              confirmPassword: "تأكيد كلمة المرور",

              passwordHint:
                  "8 أحرف على الأقل، مع حرف كبير وحرف صغير ورقم.",

              create: "إنشاء الحساب",
              creating: "جارٍ إنشاء الحساب...",

              haveAccount: "لديك حساب بالفعل؟",
              signIn: "تسجيل الدخول",

              passwordMismatch: "كلمتا المرور غير متطابقتين.",
              registerError:
                  "تعذر إنشاء الحساب. تحقق من بياناتك وحاول مرة أخرى.",

              security:
                  "يمكنك البدء باستخدام حسابك مباشرة بعد إتمام التسجيل.",

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

              formKicker: "Create account",
              title: "Start here",
              description:
                  "Create your account and start organizing your money and financial activity with ease.",

              welcomeKicker: "Personal Finance",
              welcomeTitle: "Organize your money with clarity",
              welcomeDescription:
                  "Record income and expenses, organize operations by category, and keep track of your balance in one place.",

              featureOne: "Record income and expenses",
              featureTwo: "Organize operations by category",
              featureThree: "Keep track of your balance and activity",

              name: "Name",
              email: "Email",
              password: "Password",
              confirmPassword: "Confirm password",

              passwordHint:
                  "At least 8 characters, including one uppercase letter, one lowercase letter, and one number.",

              create: "Create account",
              creating: "Creating account...",

              haveAccount: "Already have an account?",
              signIn: "Sign in",

              passwordMismatch: "Passwords do not match.",
              registerError:
                  "Unable to create the account. Please check your details and try again.",

              security:
                  "You can start using your account right after registration.",

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (form.password !== form.password_confirmation) {
            setError(text.passwordMismatch);
            return;
        }

        try {
            setSubmitting(true);

            const response = await authApi.post("/register", {
                name: form.name.trim(),
                email: form.email.trim(),
                password: form.password,
                password_confirmation: form.password_confirmation,
            });

            login(response.data);

            navigate("/dashboard", {
                replace: true,
            });
        } catch (requestError) {
            console.error("Registration error:", requestError);

            const validationErrors =
                requestError.response?.data?.errors;

            if (validationErrors) {
                const firstError = Object.values(validationErrors)
                    .flat()
                    .at(0);

                setError(firstError || text.registerError);
            } else {
                setError(
                    requestError.response?.data?.message ||
                        text.registerError
                );
            }
        } finally {
            setSubmitting(false);
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

    const passwordInputStyle = {
        flex: 1,
        border: "none",
        outline: "none",
        padding: "8px",
        background: "transparent",
        fontSize: "14px",
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
                    title={
                        isDark
                            ? text.lightMode
                            : text.darkMode
                    }
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
                            {text.welcomeKicker}
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
                            {text.formKicker}
                        </span>

                        <h2>{text.title}</h2>

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

                    <form onSubmit={handleSubmit} noValidate>
                        <div className="auth-field">
                            <label htmlFor="register-name">
                                {text.name}
                            </label>

                            <input
                                id="register-name"
                                type="text"
                                value={form.name}
                                onChange={(event) =>
                                    updateField(
                                        "name",
                                        event.target.value
                                    )
                                }
                                autoComplete="name"
                                disabled={submitting}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-email">
                                {text.email}
                            </label>

                            <input
                                id="register-email"
                                type="email"
                                value={form.email}
                                onChange={(event) =>
                                    updateField(
                                        "email",
                                        event.target.value
                                    )
                                }
                                autoComplete="email"
                                disabled={submitting}
                                required
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-password">
                                {text.password}
                            </label>

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
                                    id="register-password"
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
                                    autoComplete="new-password"
                                    disabled={submitting}
                                    required
                                    minLength={8}
                                    style={passwordInputStyle}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(
                                            (current) => !current
                                        )
                                    }
                                    disabled={submitting}
                                    aria-label={
                                        showPassword
                                            ? text.hidePassword
                                            : text.showPassword
                                    }
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
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

                            <small
                                style={{
                                    display: "block",
                                    marginTop: "4px",
                                    color: "#6c757d",
                                }}
                            >
                                {text.passwordHint}
                            </small>
                        </div>

                        <div className="auth-field">
                            <label htmlFor="register-confirm-password">
                                {text.confirmPassword}
                            </label>

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
                                    id="register-confirm-password"
                                    type={
                                        showConfirm
                                            ? "text"
                                            : "password"
                                    }
                                    value={
                                        form.password_confirmation
                                    }
                                    onChange={(event) =>
                                        updateField(
                                            "password_confirmation",
                                            event.target.value
                                        )
                                    }
                                    autoComplete="new-password"
                                    disabled={submitting}
                                    required
                                    minLength={8}
                                    style={passwordInputStyle}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirm(
                                            (current) => !current
                                        )
                                    }
                                    disabled={submitting}
                                    aria-label={
                                        showConfirm
                                            ? text.hidePassword
                                            : text.showPassword
                                    }
                                    style={{
                                        background: "none",
                                        border: "none",
                                        cursor: "pointer",
                                        padding: "8px 10px",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "#6c757d",
                                    }}
                                >
                                    {showConfirm ? (
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
                            disabled={submitting}
                        >
                            {submitting
                                ? text.creating
                                : text.create}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>{text.haveAccount}</span>{" "}
                        <Link to="/login">
                            {text.signIn}
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

export default Register;