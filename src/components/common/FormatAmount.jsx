import { useSettings } from "../../context/SettingsContext";
import { useState, useEffect } from "react";

function FormatDate({ value }) {
    const { settings } = useSettings();
    const [forceUpdate, setForceUpdate] = useState(0);

    // فرض إعادة التصيير عند تغيير date_format
    useEffect(() => {
        setForceUpdate(prev => prev + 1);
    }, [settings.date_format]);

    if (!value) return <span>-</span>;

    const date = new Date(value);
    if (isNaN(date.getTime())) return <span>{value}</span>;

    const format = settings.date_format || 'YYYY-MM-DD';

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let formatted = '';
    switch (format) {
        case 'YYYY-MM-DD':
            formatted = `${year}-${month}-${day}`;
            break;
        case 'DD/MM/YYYY':
            formatted = `${day}/${month}/${year}`;
            break;
        case 'MM/DD/YYYY':
            formatted = `${month}/${day}/${year}`;
            break;
        case 'DD-MM-YYYY':
            formatted = `${day}-${month}-${year}`;
            break;
        default:
            formatted = `${year}-${month}-${day}`;
    }

    return <span key={forceUpdate}>{formatted}</span>;
}

export default FormatDate;