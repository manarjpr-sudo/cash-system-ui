import api from "../api/axios";

const categoryService = {
    getMainCategories: async (type) => {
        const response = await api.get("/categories", { params: { type } });
        return response.data;
    },
    getSubcategories: async (parentId) => {
        const response = await api.get("/categories", { params: { parent_id: parentId } });
        return response.data;
    },
    // ✅ دالة إنشاء تصنيف جديد (أضفها)
    create: async (data) => {
        const response = await api.post("/categories", data);
        return response.data;
    },
};

export default categoryService;