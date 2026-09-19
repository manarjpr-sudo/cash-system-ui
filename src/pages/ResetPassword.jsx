import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useSearchParams,
} from "react-router-dom";
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

function ResetPassword() {
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    const [form, setForm] = useState({
        email: email || "",
        password: "",
        password_confirmation: "",
        token: token || "",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const navigate = useNavigate();
    const { language } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    const isArabic = language === "ar";

    const text = isArabic
        ? {
              brandName: "إدارة أموالي",
              brandSubtitle: "مدير مالي شخصي",

              formKicker: "إعادة تعيين كلمة المرور",
              title: "أنشئ كلمة مرور جديدة",
              description:
                  "اختر كلمة مرور جديدة لحماية حسابك والعودة إلى إدارة أموالك.",

              welcomeKicker: "مدير مالي شخصي",
              welcomeTitle: "أكمل طريقك بسهولة",
              welcomeDescription:
                  "غيّر كلمة المرور ثم سجّل الدخول من جديد لمتابعة أموالك وعملياتك.",

              email: "البريد الإلكتروني",
              password: "كلمة المرور الجديدة",
              confirmPassword: "تأكيد كلمة المرور",

              passwordHint:
                  "8 أحرف على الأقل، مع حرف كبير وحرف صغير ورقم.",

              reset: "تغيير كلمة المرور",
              resetting: "جارٍ تغيير كلمة المرور...",

              back: "العودة إلى تسجيل الدخول",

              successFallback:
                  "تم تغيير كلمة المرور بنجاح. يمكنك تسجيل الدخول الآن.",
              errorFallback:
                  "تعذر تغيير كلمة المرور. تحقق من البيانات وحاول مرة أخرى.",

              showPassword: "إظهار كلمة المرور",
              hidePassword: "إخفاء كلمة المرور",

              lightMode: "الوضع الفاتح",
              darkMode: "الوضع الداكن",
              activateLight: "تفعيل الوضع الفاتح",
              activateDark: "تفعيل الوضع الداكن",
          }
        : {
              brandName: "My Finances",
              brandSubtitle: "Personal Finance",

              formKicker: "Password reset",
              title: "Create a new password",
              description:
                  "Choose a new password to keep your account secure and get back to managing your money.",

              welcomeKicker: "Personal Finance",
              welcomeTitle: "You're almost back",
              welcomeDescription:
                  "Update your password, then sign in again to keep track of your money and operations.",

              email: "Email",
              password: "New password",
              confirmPassword: "Confirm password",

              passwordHint:
                  "At least 8 characters, including one uppercase letter, one lowercase letter, and one number.",

              reset: "Change password",
              resetting: "Changing password...",

              back: "Back to sign in",

              successFallback:
                  "Your password has been changed. You can sign in now.",
              errorFallback:
                  "We couldn't change your password. Please check your details and try again.",

              showPassword: "Show password",
              hidePassword: "Hide password",

              lightMode: "Light mode",
              darkMode: "Dark mode",
              activateLight: "Switch to light mode",
              activateDark: "Switch to dark mode",
          };

    useEffect(() => {
        if (email) {
            setForm((current) => ({
                ...current,
                email,
            }));
        }
    }, [email]);

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await authApi.post(
                "/reset-password",
                form
            );

            setMessage(
                response.data.message ||
                    text.successFallback
            );

            setTimeout(() => {
                navigate("/login", {
                    replace: true,
                });
            }, 2000);
        } catch (requestError) {
            setError(
                requestError.response?.data?.errors
                    ?.password?.[0] ||
                    requestError.response?.data?.message ||
                    text.errorFallback
            );
        } finally {
            setLoading(false);
        }
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
        <div
            className="auth-page"
            dir={isArabic ? "rtl" : "ltr"}
        >
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
                    style={{
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
                    }}
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
                </section>

                <section className="auth-form-panel">
                    <div className="auth-form-header">
                        <span className="auth-form-kicker">
                            {text.formKicker}
                        </span>

                        <h2>{text.title}</h2>

                        <p>{text.description}</p>
                    </div>

                    {message && (
                        <div className="auth-alert auth-alert-success">
                            {message}
                        </div>
                    )}

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
                            <label htmlFor="reset-email">
                                {text.email}
                            </label>

                            <input
                                id="reset-email"
                                type="email"
                                value={form.email}
                                onChange={(event) =>
                                    updateField(
                                        "email",
                                        event.target.value
                                    )
                                }
                                required
                                disabled={loading}
                                autoComplete="email"
                            />
                        </div>

                        <div className="auth-field">
                            <label htmlFor="reset-password">
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
                                    id="reset-password"
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
                                    required
                                    minLength={8}
                                    disabled={loading}
                                    autoComplete="new-password"
                                    style={passwordInputStyle}
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
                            <label htmlFor="reset-password-confirm">
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
                                    id="reset-password-confirm"
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
                                    required
                                    minLength={8}
                                    disabled={loading}
                                    autoComplete="new-password"
                                    style={passwordInputStyle}
                                />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirm(
                                            (current) => !current
                                        )
                                    }
                                    disabled={loading}
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
                            disabled={loading}
                        >
                            {loading
                                ? text.resetting
                                : text.reset}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <Link to="/login">
                            {text.back}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ResetPassword;