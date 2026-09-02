import api from "../api/axios";

const notificationService = {
    getAll: async () => {
        const response = await api.get("/notifications");
        return response.data;
    },
    getUnreadCount: async () => {
        const response = await api.get("/notifications/unread-count");
        return response.data.count;
    },
    markAsRead: async (id) => {
        await api.put(`/notifications/${id}/read`);
    },
    markAllAsRead: async () => {
        await api.put("/notifications/mark-all-read");
    },
};

export default notificationService;