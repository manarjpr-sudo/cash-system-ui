import { useSettings } from "../../context/SettingsContext";
import { useLanguage } from "../../context/LanguageContext";

function FormatDate({ value }) {
    const { settings } = useSettings();
    const { language } = useLanguage();

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    const dateFormat =
        settings.date_format || "dd/mm/yyyy";

    const parts = {
        day: String(date.getDate()).padStart(2, "0"),
        month: String(date.getMonth() + 1).padStart(2, "0"),
        year: String(date.getFullYear()),
    };

    let formattedDate;

    switch (dateFormat) {
        case "yyyy/mm/dd":
            formattedDate = `${parts.year}/${parts.month}/${parts.day}`;
            break;

        case "mm/dd/yyyy":
            formattedDate = `${parts.month}/${parts.day}/${parts.year}`;
            break;

        case "dd/mm/yyyy":
        default:
            formattedDate = `${parts.day}/${parts.month}/${parts.year}`;
            break;
    }

    return (
        <span>
            {formattedDate}
        </span>
    );
}

export default FormatDate;