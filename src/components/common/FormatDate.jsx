import { useSettings } from "../../context/SettingsContext";
import { useLanguage } from "../../context/LanguageContext";
import { useState, useEffect } from "react";

function FormatDate({ value, showTime = true }) {
    const { settings } = useSettings();
    const { language } = useLanguage();
    const [forceUpdate, setForceUpdate] = useState(0);

    // فرض إعادة التصيير عند تغيير تنسيق التاريخ
    useEffect(() => {
        setForceUpdate(prev => prev + 1);
    }, [settings.date_format]);

    if (!value) return <span>-</span>;

    const date = new Date(value);
    if (isNaN(date.getTime())) return <span>{value}</span>;

    // ============================================================
    // 1. تنسيق التاريخ حسب الإعدادات
    // ============================================================
    const format = settings.date_format || 'YYYY-MM-DD';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    let dateStr = '';
    switch (format) {
        case 'YYYY-MM-DD':
            dateStr = `${year}-${month}-${day}`;
            break;
        case 'DD/MM/YYYY':
            dateStr = `${day}/${month}/${year}`;
            break;
        case 'MM/DD/YYYY':
            dateStr = `${month}/${day}/${year}`;
            break;
        case 'DD-MM-YYYY':
            dateStr = `${day}-${month}-${year}`;
            break;
        default:
            dateStr = `${year}-${month}-${day}`;
    }

    // ============================================================
    // 2. تنسيق الوقت (12 ساعة مع صباحاً/مساءً أو AM/PM)
    // ============================================================
    let timeStr = '';
    if (showTime) {
        let hours = date.getHours();
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const hours12 = hours % 12 || 12; // 0 تصبح 12

        // تحديد النص حسب اللغة
        const ampmText = language === 'ar'
            ? (ampm === 'AM' ? 'ص' : 'م')
            : ampm;

        // صيغة الوقت: 12:30 صباحاً / 12:30 PM
        timeStr = `${hours12}:${minutes} ${ampmText}`;
    }

    // ============================================================
    // 3. دمج التاريخ والوقت
    // ============================================================
    const formatted = showTime ? `${dateStr} ${timeStr}` : dateStr;

    return <span key={forceUpdate}>{formatted}</span>;
}

export default FormatDate;