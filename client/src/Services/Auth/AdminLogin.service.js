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

        // 1. Gọi API POST /login (endpoint đầy đủ là http://localhost:5000/api/admin/login)
        const response = await adminApi.post("/login", payload);
        

        // 2. Lưu token vào localStorage (admin_token) để các request sau tự động gắn Bearer Token
        if (response?.token) {
            localStorage.setItem(TOKEN_KEYS.ADMIN, response.token);
        }

        // 3. Lưu thông tin admin để hiển thị trên UI/Header nếu cần
        if (response?.admin) {
            localStorage.setItem(ADMIN_INFO_KEY, JSON.stringify(response.admin));
        }

        // 4. Bắt buộc return response để component nhận được dữ liệu
        return response;
    } catch (error) {
        console.error("Admin login error:", error);
        throw error;
    }
};

/**
 * Đăng xuất tài khoản Admin: xóa token và thông tin admin khỏi localStorage
 */
export const adminLogout = () => {
    localStorage.removeItem(TOKEN_KEYS.ADMIN);
    localStorage.removeItem(ADMIN_INFO_KEY);
};

/**
 * Lấy thông tin Admin hiện tại từ localStorage
 */
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
