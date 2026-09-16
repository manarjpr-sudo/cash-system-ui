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
    const { t, language } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    const isArabic = language === "ar";

    const text = isArabic
        ? {
              kicker: "إنشاء حساب",
              title: "أنشئ حسابك",
              description:
                  "أنشئ حسابًا جديدًا وابدأ مباشرة بإدارة دخلك ومصروفاتك.",
              welcomeKicker: "إدارة مالية شخصية",
              welcomeTitle: "ابدأ بتنظيم أموالك بسهولة",
              welcomeDescription:
                  "سجّل دخلك ومصروفاتك، نظّم عملياتك حسب التصنيفات، وتابع رصيدك في مكان واحد.",
              featureOne: "تسجيل الدخل والمصروفات",
              featureTwo: "تصنيفات رئيسية وفرعية",
              featureThree: "متابعة الرصيد والعمليات",
              passwordHint:
                  "8 أحرف على الأقل، حرف كبير، حرف صغير، ورقم.",
              create: "إنشاء الحساب",
              creating: "جارٍ إنشاء الحساب...",
              haveAccount: "لديك حساب بالفعل؟",
              registerError:
                  "تعذر إنشاء الحساب. تحقق من البيانات وحاول مرة أخرى.",
              passwordMismatch: "كلمتا المرور غير متطابقتين.",
              security:
                  "يتم إنشاء الحساب وتفعيله مباشرة بعد نجاح التسجيل.",
          }
        : {
              kicker: "ACCOUNT REGISTRATION",
              title: "Create your account",
              description:
                  "Create an account and start managing your income and expenses.",
              welcomeKicker: "PERSONAL FINANCE",
              welcomeTitle: "Start organizing your finances",
              welcomeDescription:
                  "Record income and expenses, organize operations by category, and track your balance in one place.",
              featureOne: "Record income and expenses",
              featureTwo: "Main and subcategory organization",
              featureThree: "Track your balance and operations",
              passwordHint:
                  "At least 8 characters, one uppercase, one lowercase, and one number.",
              create: "Create account",
              creating: "Creating account...",
              haveAccount: "Already have an account?",
              registerError:
                  "Unable to create the account. Please check your information and try again.",
              passwordMismatch: "Passwords do not match.",
              security:
                  "Your account is activated immediately after successful registration.",
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

            const validationErrors = requestError.response?.data?.errors;

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
                            {text.kicker}
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
                                {t("auth.fullName")}
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
                                {t("auth.email")}
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
                                {t("auth.password")}
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
                                {t("auth.confirmPassword")}
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
                                    value={form.password_confirmation}
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
                            {submitting ? text.creating : text.create}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <span>{text.haveAccount}</span>{" "}
                        <Link to="/login">{t("auth.signIn")}</Link>
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