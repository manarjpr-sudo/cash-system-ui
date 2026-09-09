import { useSettings } from "../../context/SettingsContext";
import { useLanguage } from "../../context/LanguageContext";
import { CURRENCIES } from "../../constants/currencies";

function FormatAmount({ value, showCurrency = true }) {
    const { settings } = useSettings();
    const { language } = useLanguage();

    let num = parseFloat(value);
    if (isNaN(num)) num = 0;
    const amount = num;

    const found = CURRENCIES.find(c => c.code === settings.currency);
    const defaultCurrency = CURRENCIES.find(c => c.code === 'USD');
    const currency = found || defaultCurrency;

    const symbol = language === 'ar' ? currency.symbol_ar : currency.symbol_en;
    const shouldShowCurrency = showCurrency && settings.show_currency_symbol !== false;

    const formattedNumber = amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });

    return (
        <span className="fw-bold">
            {shouldShowCurrency
                ? `${formattedNumber} ${symbol}`
                : formattedNumber
            }
        </span>
    );
}

export default FormatAmount;