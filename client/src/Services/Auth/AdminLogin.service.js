import { adminApi, TOKEN_KEYS } from "../../config/axios.config.jsx";

export const ADMIN_INFO_KEY = "admin_info";

/**
 * Service xử lý đăng nhập cho Admin
 * @param {Object} payload - { username, password }
 * @returns {Promise<Object>} response từ backend gồm { message, token, admin }
 */
export const adminLogin = async (payload) => {
    try {
        console.log("Admin login payload:", payload);

        const response = await adminApi.post("/login", payload);
        
        if (response?.token) {
            localStorage.setItem(TOKEN_KEYS.ADMIN, response.token);
        }

        if (response?.admin) {
            localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(response.admin));
        }

        return response;
    } catch (error) {
        console.error("Admin login error:", error);
        throw error;
    }
};

export const adminLogout = () => {
    localStorage.removeItem(TOKEN_KEYS.ADMIN);
    localStorage.removeItem(ADMIN_INFO_KEY);
};


export const getCurrentAdmin = () => {
    try {
        const info = localStorage.getItem(ADMIN_INFO_KEY);
        return info ? JSON.parse(info) : null;
    } catch {
        return null;
    }
};

/**
 * Kiểm tra xem Admin đã đăng nhập chưa
 */
export const isAdminAuthenticated = () => {
    return !!localStorage.getItem(TOKEN_KEYS.ADMIN);
};

