import { useState, useEffect } from "react";
import { getSettings } from "../../services/settingsService";

function FormatAmount({ value, showCurrency = true }) {
    const [currencySymbol, setCurrencySymbol] = useState("$");

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getSettings();
            setCurrencySymbol(settings.currency_symbol || "$");
        };
        loadSettings();
    }, []);

    const num = Number(value);
    const amount = isNaN(num) ? 0 : num;

    return (
        <span className="fw-bold">
            {showCurrency ? `${currencySymbol} ` : ""}
            {amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            })}
        </span>
    );
}

export default FormatAmount;