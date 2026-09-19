import api from "../api/axios";

const categoryService = {
    getAll: async (includeInactive = false) => {
        const [incomeResponse, expenseResponse] =
            await Promise.all([
                api.get("/categories", {
                    params: {
                        type: "income",
                        parent_id: "",
                        include_inactive: includeInactive
                            ? 1
                            : 0,
                    },
                }),

                api.get("/categories", {
                    params: {
                        type: "expense",
                        parent_id: "",
                        include_inactive: includeInactive
                            ? 1
                            : 0,
                    },
                }),
            ]);

        return [
            ...(Array.isArray(
                incomeResponse.data
            )
                ? incomeResponse.data
                : []),

            ...(Array.isArray(
                expenseResponse.data
            )
                ? expenseResponse.data
                : []),
        ];
    },

    getByType: async (
        type,
        includeInactive = false
    ) => {
        const response = await api.get(
            "/categories",
            {
                params: {
                    type,
                    parent_id: "",
                    include_inactive:
                        includeInactive ? 1 : 0,
                },
            }
        );

        return Array.isArray(response.data)
            ? response.data
            : [];
    },

    create: async (data) => {
        const response = await api.post(
            "/categories",
            data
        );

        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(
            `/categories/${id}`,
            data
        );

        return response.data;
    },

    toggleStatus: async (id) => {
        const response = await api.patch(
            `/categories/${id}/status`
        );

        return response.data;
    },

    /*
     * أبقيت الحذف القديم موجودًا للتوافق،
     * لكن واجهة المستخدم الجديدة لن تستخدمه.
     */
    remove: async (id) => {
        const response = await api.delete(
            `/categories/${id}`
        );

        return response.data;
    },
};

export default categoryService;