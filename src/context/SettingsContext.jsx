import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const SettingsContext = createContext(null);

const defaultSettings = {
    company_name_ar: "إدارة أموالي",
    company_name_en: "My Finances",
    slogan_ar: "إدارة أموالك بطريقة أبسط",
    slogan_en: "Manage your money with clarity",
    currency: "USD",
    currency_symbol: "$",
    date_format: "dd/mm/yyyy",
    timezone: "Asia/Riyadh",
    items_per_page: 20,
    show_currency_symbol: true,
};

export function SettingsProvider({ children }) {
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

            setSettings((previous) => ({
                ...previous,
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

            setSettings((previous) => ({
                ...previous,
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
}

export function useSettings() {
    const context = useContext(SettingsContext);

    if (!context) {
        throw new Error(
            "useSettings must be used inside SettingsProvider."
        );
    }

    return context;
}