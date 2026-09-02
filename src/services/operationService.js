import api from "../api/axios";

const operationService = {
    getAll: (params = {}) => api.get("/operations", { params }),
    getById: (id) => api.get(`/operations/${id}`),
    create: (data) => api.post("/operations", data),
    update: (id, data) => api.put(`/operations/${id}`, data),
    delete: (id) => api.delete(`/operations/${id}`),
};

export default operationService;