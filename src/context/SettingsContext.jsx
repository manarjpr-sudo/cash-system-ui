import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const SettingsContext = createContext();

const defaultSettings = {
    company_name_ar: "نظام إدارة النقد",
    company_name_en: "Cash Management System",
    slogan_ar: "إدارة مالية ذكية",
    slogan_en: "Smart Financial Management",
    currency: "USD",
    currency_symbol: "$",
    date_format: "dd/mm/yyyy",
    timezone: "Asia/Riyadh",
    auto_approve: false,
    items_per_page: 10,
    show_currency_symbol: true,
};

export const SettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);

    const loadSettings = async () => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        try {
            const response = await api.get("/settings");

            setSettings((prev) => ({
                ...prev,
                ...response.data,
            }));
        } catch (error) {
            console.error("Failed to load settings:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadSettings();
    }, []);

    const updateSettings = async (newSettings) => {
        try {
            await api.put("/settings", newSettings);

            setSettings((prev) => ({
                ...prev,
                ...newSettings,
            }));

            return true;
        } catch (error) {
            console.error("Failed to update settings:", error);
            return false;
        }
    };

    return (
        <SettingsContext.Provider
            value={{
                settings,
                loading,
                updateSettings,
                loadSettings,
            }}
        >
            {children}
        </SettingsContext.Provider>
    );
};

export const useSettings = () => useContext(SettingsContext);