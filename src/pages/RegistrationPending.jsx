import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function RegistrationPending() {
    const { t, language, changeLanguage } = useLanguage();

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{ background: '#f4f6f9' }}>
            <div className="card shadow-lg border-0" style={{ maxWidth: '460px', width: '100%', borderRadius: '16px' }}>
                <div className="card-body p-5 text-center">
                    {/* أيقونة الحالة */}
                    <div className="bg-warning bg-opacity-10 rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4" style={{ width: '64px', height: '64px' }}>
                        <span style={{ fontSize: '28px' }}>⏳</span>
                    </div>

                    <h4 className="fw-bold mb-1">{t("auth.pendingTitle")}</h4>
                    <p className="text-muted small">{t("auth.pendingMessage")}</p>

                    <div className="bg-light rounded-3 p-3 mt-4 d-flex justify-content-between align-items-center">
                        <span className="fw-semibold small">{language === 'ar' ? 'الحالة' : 'Status'}</span>
                        <span className="badge bg-warning text-dark px-3 py-2">{language === 'ar' ? 'بانتظار الموافقة' : 'Pending Approval'}</span>
                    </div>

                    <p className="text-muted small mt-4 mb-0">
                        {language === 'ar'
                            ? 'سيتم تفعيل الحساب ومنح الصلاحيات بعد اعتماد الطلب من مدير النظام.'
                            : 'Your account will be activated and permissions assigned after administrator approval.'}
                    </p>

                    <Link
                        to="/login"
                        className="btn btn-primary w-100 mt-4"
                        style={{ borderRadius: '10px', padding: '10px' }}
                    >
                        {t("auth.returnToLogin")}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default RegistrationPending;