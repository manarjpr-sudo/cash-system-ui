import api from "../api/axios";

const reportService = {
    getReport: async (params = {}) => {
        const response = await api.get("/reports", {
            params,
        });

        return response.data;
    },
};

export default reportService;