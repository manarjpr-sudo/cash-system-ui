import { useState, useEffect } from "react";
import { getSettings } from "../../services/settingsService";
import { useLanguage } from "../../context/LanguageContext";

function FormatDate({ value }) {
    const { language } = useLanguage();
    const [dateFormat, setDateFormat] = useState("dd/mm/yyyy");

    useEffect(() => {
        const loadSettings = async () => {
            const settings = await getSettings();
            setDateFormat(settings.date_format || "dd/mm/yyyy");
        };
        loadSettings();
    }, []);

    if (!value) return "-";

    const date = new Date(value);
    if (isNaN(date.getTime())) return "-";

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");

    // ✅ تحديد AM/PM حسب اللغة
    let ampm;
    if (language === "ar") {
        ampm = hours >= 12 ? "م" : "ص";
    } else {
        ampm = hours >= 12 ? "PM" : "AM";
    }
    const hours12 = hours % 12 || 12;
    const hours12Str = String(hours12).padStart(2, "0");

    const formatMap = {
        "dd/mm/yyyy": `${day}/${month}/${year}`,
        "mm/dd/yyyy": `${month}/${day}/${year}`,
        "yyyy/mm/dd": `${year}/${month}/${day}`,
        "dd-mm-yyyy": `${day}-${month}-${year}`,
        "mm-dd-yyyy": `${month}-${day}-${year}`,
        "yyyy-mm-dd": `${year}-${month}-${day}`,
        "dd.mm.yyyy": `${day}.${month}.${year}`,
        "mm.dd.yyyy": `${month}.${day}.${year}`,
        "yyyy.mm.dd": `${year}.${month}.${day}`,
    };

    const formattedDate = formatMap[dateFormat] || `${day}/${month}/${year}`;

    return (
        <span dir="ltr" style={{ display: 'inline-block', fontVariantNumeric: 'tabular-nums' }}>
            {formattedDate} {hours12Str}:{minutes} {ampm}
        </span>
    );
}

export default FormatDate;