import { useSettings } from "../../context/SettingsContext";
import { useLanguage } from "../../context/LanguageContext";
import { CURRENCIES } from "../../constants/currencies";

function FormatAmount({ value, showCurrency = true }) {
    const { settings } = useSettings();
    const { language } = useLanguage();

    // تحويل القيمة إلى رقم
    let num = parseFloat(value);
    if (isNaN(num)) num = 0;
    const amount = num;

    // البحث عن العملة المختارة في القائمة
    const found = CURRENCIES.find(c => c.code === settings.currency);
    
    // تحديد الرمز حسب اللغة الحالية
    const symbol = found
        ? (language === 'ar' ? found.symbol_ar : found.symbol_en)
        : (language === 'ar' ? 'ر.س' : 'SAR');

    // التحقق من إظهار الرمز
    const shouldShowCurrency = showCurrency && settings.show_currency_symbol !== false;

    // تنسيق الرقم
    const formattedNumber = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <span className="fw-bold" key={`${settings.currency}-${language}`}>
            {shouldShowCurrency
                ? `${formattedNumber} ${symbol}`  // ✅ رمز العملة بعد الرقم
                : formattedNumber
            }
        </span>
    );
}

export default FormatAmount;