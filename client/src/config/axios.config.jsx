import axios from "axios";

// Đọc các URL từ biến môi trường Vite (.env)
const ADMIN_BASE_URL = import.meta.env.VITE_ADMIN_API || "http://localhost:5000/api/admin";
const OWNER_BASE_URL = import.meta.env.VITE_OWNER_API || "http://localhost:5000/api/owner";
const CUSTOMER_BASE_URL = import.meta.env.VITE_CUSTOMER_API || "http://localhost:5000/api/customer";
const PUBLIC_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

/**
 * Tên key lưu trữ Token trong localStorage cho từng vai trò
 */
export const TOKEN_KEYS = {
  ADMIN: "admin_token",
  OWNER: "owner_token",
  CUSTOMER: "customer_token",
};

/**
 * Hàm khởi tạo axios instance dùng chung với cấu hình chuẩn
 * - Tự động đính kèm Bearer token tương ứng nếu có
 * - Tự động bóc tách (unwrap) response.data để dùng trực tiếp
 */
const createApiClient = (baseURL, tokenKey) => {
  const instance = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
    },
    timeout: 15000,
  });

  // Request Interceptor: Tự động thêm Bearer token vào header
  instance.interceptors.request.use(
    (config) => {
      if (tokenKey) {
        const token = localStorage.getItem(tokenKey) || sessionStorage.getItem(tokenKey);
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Response Interceptor: Gỡ sẵn res.data và chuẩn hóa lỗi
  instance.interceptors.response.use(
    (response) => {
      // Trả thẳng dữ liệu từ backend (không cần .data ở phía gọi)
      return response.data;
    },
    (error) => {
      // Chuẩn hóa lỗi trả về từ backend
      const responseData = error.response?.data;
      const status = error.response?.status;

      if (status === 401 && tokenKey) {
        console.warn(`[${tokenKey}] Phiên đăng nhập hết hạn hoặc chưa được xác thực.`);
      }

      const formattedError = responseData || {
        message: error.message || "Đã xảy ra lỗi khi kết nối tới máy chủ.",
      };

      if (typeof formattedError === "object" && formattedError !== null) {
        formattedError.status = status;
        formattedError.response = error.response;
      }

      return Promise.reject(formattedError);
    }
  );

  return instance;
};

// Khởi tạo các API Client theo từng vai trò
export const adminApi = createApiClient(ADMIN_BASE_URL, TOKEN_KEYS.ADMIN);
export const ownerApi = createApiClient(OWNER_BASE_URL, TOKEN_KEYS.OWNER);
export const customerApi = createApiClient(CUSTOMER_BASE_URL, TOKEN_KEYS.CUSTOMER);
export const publicApi = createApiClient(PUBLIC_BASE_URL);

export default {
  adminApi,
  ownerApi,
  customerApi,
  publicApi,
};
