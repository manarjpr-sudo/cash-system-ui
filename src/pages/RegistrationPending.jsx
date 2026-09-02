import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RegistrationPending() {
    const { t, language, changeLanguage } = useLanguage();

    return (
        <div className="auth-page">

            <div className="auth-language-switcher">

                <button
                    type="button"
                    className={
                        language === "ar"
                            ? "language-button active"
                            : "language-button"
                    }
                    onClick={() => changeLanguage("ar")}
                >
                    العربية
                </button>

                <span className="language-divider">/</span>

                <button
                    type="button"
                    className={
                        language === "en"
                            ? "language-button active"
                            : "language-button"
                    }
                    onClick={() => changeLanguage("en")}
                >
                    English
                </button>

            </div>


            <div className="auth-card auth-card-center">

                <div className="status-icon status-icon-warning">
                    !
                </div>

                <div className="auth-form-kicker">
                    {language === "ar"
                        ? "حالة التسجيل"
                        : "REGISTRATION STATUS"}
                </div>

                <h2>
                    {t("auth.pendingTitle")}
                </h2>

                <p className="status-message">
                    {t("auth.pendingMessage")}
                </p>


                <div className="status-box">

                    <strong>
                        {t("common.status")}
                    </strong>

                    <span>
                        {t("auth.pendingStatus")}
                    </span>

                </div>


                <p className="status-note">
                    {language === "ar"
                        ? "سيتم تفعيل الحساب ومنح الصلاحيات بعد اعتماد الطلب من مدير النظام."
                        : "Your account will be activated and permissions assigned after administrator approval."}
                </p>


                <Link
                    to="/login"
                    className="auth-submit auth-link-button"
                >
                    {t("auth.returnToLogin")}
                </Link>

            </div>

        </div>
    );
}

export default RegistrationPending;