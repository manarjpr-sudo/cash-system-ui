import api from "../api/axios";

let cachedSettings = null;

export const getSettings = async () => {
    if (cachedSettings) {
        return cachedSettings;
    }
    try {
        const response = await api.get("/settings");
        cachedSettings = response.data;
        return cachedSettings;
    } catch (error) {
        console.error("Failed to load settings:", error);
        return {
            currency_symbol: "$",
            date_format: "dd/mm/yyyy",
        };
    }
};

export const clearSettingsCache = () => {
    cachedSettings = null;
};