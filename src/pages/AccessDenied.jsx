import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AccessDenied() {
    const { language } = useLanguage();

    const isArabic = language === "ar";

    const text = isArabic
        ? {
              brandName: "إدارة أموالي",
              brandSubtitle: "مدير مالي شخصي",
              title: "لا يمكنك الوصول إلى هذه الصفحة",
              message:
                  "ليس لديك الصلاحية المطلوبة لعرض هذه الصفحة.",
              back: "العودة إلى الرئيسية",
          }
        : {
              brandName: "My Finances",
              brandSubtitle: "Personal Finance",
              title: "You can't access this page",
              message:
                  "You don't have the permission required to view this page.",
              back: "Back to home",
          };

    return (
        <div
            className="auth-page"
            dir={isArabic ? "rtl" : "ltr"}
        >
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
                            403
                        </div>

                        <h1>{text.title}</h1>

                        <p>{text.message}</p>
                    </div>
                </section>

                <section className="auth-form-panel d-flex flex-column justify-content-center">
                    <div className="text-center">
                        <div
                            style={{
                                fontSize: "64px",
                                fontWeight: 800,
                                color: "#ef4444",
                                lineHeight: 1,
                            }}
                        >
                            403
                        </div>

                        <div className="auth-form-header mt-4">
                            <h2>{text.title}</h2>
                            <p>{text.message}</p>
                        </div>

                        <Link
                            to="/dashboard"
                            className="auth-submit d-flex align-items-center justify-content-center text-decoration-none mt-4"
                        >
                            {text.back}
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default AccessDenied;