import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

function AccessDenied() {
    const { language } = useLanguage();

    return (
        <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "80vh" }}>
            <h1 className="display-1 text-danger">403</h1>
            <h2>{language === 'ar' ? 'غير مصرح بالوصول' : 'Access Denied'}</h2>
            <p className="text-muted">
                {language === 'ar' 
                    ? 'ليس لديك الصلاحية لزيارة هذه الصفحة.' 
                    : 'You do not have permission to access this page.'}
            </p>
            <Link to="/dashboard" className="btn btn-primary">
                {language === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to Dashboard'}
            </Link>
        </div>
    );
}

export default AccessDenied;