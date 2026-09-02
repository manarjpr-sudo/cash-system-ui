import api from "../api/axios";

const approvalService = {
    getAll: () => api.get("/approvals"),
    getById: (id) => api.get(`/approvals/${id}`),
    store: (data) => api.post("/approvals", data),
    update: (id, data) => api.put(`/approvals/${id}`, data),
    delete: (id) => api.delete(`/approvals/${id}`),
};

export default approvalService;