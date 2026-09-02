import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
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
    const { language, changeLanguage } = useLanguage();

    useEffect(() => {
        if (email) {
            setForm(prev => ({ ...prev, email }));
        }
    }, [email]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/reset-password", form);
            setMessage(response.data.message);
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(
                err.response?.data?.errors?.password?.[0] ||
                err.response?.data?.message ||
                "Unable to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-language-switcher">
                <button
                    type="button"
                    className={language === "ar" ? "language-button active" : "language-button"}
                    onClick={() => changeLanguage("ar")}
                >
                    العربية
                </button>
                <span className="language-divider">/</span>
                <button
                    type="button"
                    className={language === "en" ? "language-button active" : "language-button"}
                    onClick={() => changeLanguage("en")}
                >
                    English
                </button>
            </div>

            <div className="auth-shell">
                <section className="auth-brand-panel">
                    <div className="auth-brand-main">
                        <div className="auth-logo">$</div>
                        <div>
                            <div className="auth-system-name">Cash System</div>
                            <div className="auth-system-subtitle">Financial Management</div>
                        </div>
                    </div>
                    <div className="auth-brand-content">
                        <h1>Reset Password</h1>
                        <p>Enter your new password below.</p>
                    </div>
                </section>

                <section className="auth-form-panel">
                    <div className="auth-form-header">
                        <h2>New Password</h2>
                    </div>

                    {message && <div className="auth-alert auth-alert-success">{message}</div>}
                    {error && <div className="auth-alert auth-alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* 🔥 حقل كلمة المرور */}
                        <div className="auth-field">
                            <label htmlFor="password">New Password</label>
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
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    required
                                    minLength={8}
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
                                    {/* 🔥 التعديل هنا: مغلق افتراضياً */}
                                    {showPassword ? <EyeOpen /> : <EyeClosed />}
                                </button>
                            </div>
                            <small style={{ display: 'block', marginTop: '4px', color: '#6c757d' }}>
                                Must contain at least 8 characters, one uppercase, one lowercase, and one number.
                            </small>
                        </div>

                        {/* 🔥 حقل تأكيد كلمة المرور */}
                        <div className="auth-field">
                            <label htmlFor="password_confirmation">Confirm Password</label>
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
                                    id="password_confirmation"
                                    type={showConfirm ? "text" : "password"}
                                    value={form.password_confirmation}
                                    onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                                    required
                                    minLength={8}
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
                                    {/* 🔥 التعديل هنا: مغلق افتراضياً */}
                                    {showConfirm ? <EyeOpen /> : <EyeClosed />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? "Resetting..." : "Reset Password"}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <Link to="/login">Back to Login</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default ResetPassword;