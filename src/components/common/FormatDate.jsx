import { useSettings } from "../../context/SettingsContext";

function FormatDate({ value }) {
    const { settings } = useSettings();

    if (!value) {
        return "-";
    }

    const rawValue = String(value);

    let parts;

    /*
     * إذا كان التاريخ قادمًا بصيغة:
     * 2026-08-10
     * أو:
     * 2026-08-10T00:00:00...
     *
     * نأخذ تاريخ اليوم نفسه مباشرة،
     * حتى لا يتغير بسبب المنطقة الزمنية.
     */
    const isoMatch = rawValue.match(
        /^(\d{4})-(\d{2})-(\d{2})/
    );

    if (isoMatch) {
        parts = {
            year: isoMatch[1],
            month: isoMatch[2],
            day: isoMatch[3],
        };
    } else {
        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        parts = {
            day: String(date.getDate()).padStart(2, "0"),
            month: String(date.getMonth() + 1).padStart(
                2,
                "0"
            ),
            year: String(date.getFullYear()),
        };
    }

    const dateFormat = String(
        settings?.date_format || "dd/mm/yyyy"
    ).toLowerCase();

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

    return <span>{formattedDate}</span>;
}

export default FormatDate;