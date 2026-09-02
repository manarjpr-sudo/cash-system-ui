import api from "../api/axios";

const dashboardService = {
    getDashboard: async () => {
        const response = await api.get("/dashboard"); // ✅ مسار صحيح
        return response.data;
    },
};

export default dashboardService;