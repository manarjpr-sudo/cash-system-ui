import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api/v1",
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 🔥 إضافة Interceptor للردود
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // إذا كان الخطأ 401 (Unauthorized)
        if (error.response?.status === 401) {
            // حذف البيانات المحلية
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            // إعادة التوجيه إلى تسجيل الدخول (إذا لم يكن بالفعل هناك)
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }
        return Promise.reject(error);
    }
);

export default api;