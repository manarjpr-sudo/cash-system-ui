import { useSettings } from "../../context/SettingsContext";
import { useLanguage } from "../../context/LanguageContext";
import { CURRENCIES } from "../../constants/currencies";

function FormatAmount({ value, showCurrency = true }) {
    const { settings } = useSettings();
    const { language } = useLanguage();

    let num = parseFloat(value);

    if (Number.isNaN(num)) {
        num = 0;
    }

    const amount = num;

    const selectedCurrency =
        settings?.currency || "USD";

    const isCustomCurrency =
        selectedCurrency === "CUSTOM";

    const found = CURRENCIES.find(
        (currency) =>
            currency.code === selectedCurrency
    );

    let symbol = settings?.currency_symbol || "$";

    if (!isCustomCurrency && found) {
        symbol =
            language === "ar"
                ? found.symbol_ar ||
                  found.symbol_en ||
                  found.code
                : found.symbol_en ||
                  found.symbol_ar ||
                  found.code;
    }

    const shouldShowCurrency =
        showCurrency &&
        settings?.show_currency_symbol !== false;

    const formattedNumber = amount.toLocaleString(
        undefined,
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }
    );

    return (
        <span
            className="fw-bold"
            key={`${selectedCurrency}-${symbol}-${language}`}
        >
            {shouldShowCurrency
                ? `${formattedNumber} ${symbol}`
                : formattedNumber}
        </span>
    );
}

export default FormatAmount;