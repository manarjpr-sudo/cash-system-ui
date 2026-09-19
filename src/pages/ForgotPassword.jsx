import { useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import { authApi } from "../api/axios";
import { FaMoon, FaSun } from "react-icons/fa";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const { language } = useLanguage();
    const { isDark, toggleTheme } = useTheme();

    const isArabic = language === "ar";

    const text = isArabic
        ? {
              brandName: "إدارة أموالي",
              brandSubtitle: "مدير مالي شخصي",

              formKicker: "استعادة كلمة المرور",
              title: "نسيت كلمة المرور؟",
              description:
                  "أدخل بريدك الإلكتروني وسنرسل لك رابطًا لإعادة تعيين كلمة المرور.",

              welcomeKicker: "مدير مالي شخصي",
              welcomeTitle: "استعد الوصول إلى حسابك",
              welcomeDescription:
                  "لا تقلق، يمكنك استعادة كلمة المرور والعودة إلى متابعة أموالك بسهولة.",

              email: "البريد الإلكتروني",
              placeholder: "name@example.com",

              send: "إرسال رابط الاستعادة",
              sending: "جارٍ الإرسال...",

              back: "العودة إلى تسجيل الدخول",

              security:
                  "سنستخدم بريدك الإلكتروني لإرسال رابط آمن لإعادة تعيين كلمة المرور.",

              defaultError:
                  "تعذر إرسال رابط الاستعادة. تحقق من بريدك الإلكتروني وحاول مرة أخرى.",

              lightMode: "الوضع الفاتح",
              darkMode: "الوضع الداكن",
              activateLight: "تفعيل الوضع الفاتح",
              activateDark: "تفعيل الوضع الداكن",
          }
        : {
              brandName: "My Finances",
              brandSubtitle: "Personal Finance",

              formKicker: "Password recovery",
              title: "Forgot your password?",
              description:
                  "Enter your email and we'll send you a link to reset your password.",

              welcomeKicker: "Personal Finance",
              welcomeTitle: "Get back into your account",
              welcomeDescription:
                  "No worries. Reset your password and get back to managing your money with ease.",

              email: "Email",
              placeholder: "name@example.com",

              send: "Send reset link",
              sending: "Sending...",

              back: "Back to sign in",

              security:
                  "We'll use your email to send a secure password reset link.",

              defaultError:
                  "We couldn't send the reset link. Please check your email and try again.",

              lightMode: "Light mode",
              darkMode: "Dark mode",
              activateLight: "Switch to light mode",
              activateDark: "Switch to dark mode",
          };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await authApi.post(
                "/forgot-password",
                { email: email.trim() }
            );

            setMessage(response.data.message);
            setEmail("");
        } catch (requestError) {
            setError(
                requestError.response?.data?.errors?.email?.[0] ||
                    requestError.response?.data?.message ||
                    text.defaultError
            );
        } finally {
            setLoading(false);
        }
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
                            <label htmlFor="forgot-email">
                                {text.email}
                            </label>

                            <input
                                id="forgot-email"
                                type="email"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                                required
                                disabled={loading}
                                placeholder={text.placeholder}
                                autoComplete="email"
                            />
                        </div>

                        <button
                            type="submit"
                            className="auth-submit"
                            disabled={loading}
                        >
                            {loading
                                ? text.sending
                                : text.send}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <Link to="/login">
                            {text.back}
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

export default ForgotPassword;