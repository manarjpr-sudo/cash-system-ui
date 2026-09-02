import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const { language, changeLanguage } = useLanguage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");

        try {
            const response = await axios.post("http://127.0.0.1:8000/api/forgot-password", { email });
            setMessage(response.data.message);
            setEmail("");
        } catch (err) {
            setError(
                err.response?.data?.errors?.email?.[0] ||
                err.response?.data?.message ||
                "Unable to send reset link."
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
                        <h1>Reset Your Password</h1>
                        <p>Enter your email address and we'll send you a link to reset your password.</p>
                    </div>
                </section>

                <section className="auth-form-panel">
                    <div className="auth-form-header">
                        <h2>Forgot Password</h2>
                    </div>

                    {message && <div className="auth-alert auth-alert-success">{message}</div>}
                    {error && <div className="auth-alert auth-alert-error">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="auth-field">
                            <label htmlFor="email">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                                placeholder="your@email.com"
                            />
                        </div>

                        <button type="submit" className="auth-submit" disabled={loading}>
                            {loading ? "Sending..." : "Send Reset Link"}
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

export default ForgotPassword;