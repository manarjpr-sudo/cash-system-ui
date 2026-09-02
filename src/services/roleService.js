import api from "../api/axios";

const roleService = {
    getAll: async () => {
        const response = await api.get("/roles");
        return response.data;
    },
    getPermissions: async () => {
        const response = await api.get("/permissions");
        return response.data;
    },
    create: async (data) => {
        const response = await api.post("/roles", data);
        return response.data;
    },
    update: async (id, data) => {
        const response = await api.put(`/roles/${id}`, data);
        return response.data;
    },
    delete: async (id) => {
        await api.delete(`/roles/${id}`);
    },
};

export default roleService;