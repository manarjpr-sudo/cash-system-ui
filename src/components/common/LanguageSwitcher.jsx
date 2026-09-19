import { useLanguage } from "../../context/LanguageContext";

function LanguageSwitcher() {
    const { language, changeLanguage } = useLanguage();

    const toggleLanguage = () => {
        changeLanguage(language === 'ar' ? 'en' : 'ar');
    };

    const isArabic = language === 'ar';

    return (
        <button
            type="button"
            onClick={toggleLanguage}
            className="btn d-flex align-items-center justify-content-center"
            style={{
                width: '34px',
                height: '34px',
                padding: '0',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                background: isArabic ? '#2563eb' : 'transparent',
                color: isArabic ? '#ffffff' : '#475569',
                fontWeight: 600,
                fontSize: '11px',
                transition: 'all 0.2s ease',
                boxShadow: '0 1px 2px rgba(0,0,0,0.02)',
                cursor: 'pointer',
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#94a3b8';
                if (!isArabic) {
                    e.currentTarget.style.color = '#0f172a';
                    e.currentTarget.style.background = '#f8fafc';
                }
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                if (!isArabic) {
                    e.currentTarget.style.color = '#475569';
                    e.currentTarget.style.background = 'transparent';
                }
            }}
            title={isArabic ? 'Switch to English' : 'تبديل إلى العربية'}
        >
            {isArabic ? 'EN' : 'AR'}
        </button>
    );
}

export default LanguageSwitcher;