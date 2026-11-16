import { adminApi } from "../../config/axios.config.jsx";

/**
 * Service lấy thông tin hồ sơ Admin theo adminId
 * @param {string} adminId - ID của tài khoản Admin
 * @returns {Promise<Object>} { message: string, admin: Object }
 */
export const getAdminProfile = async (adminId) => {
  try {
    const response = await adminApi.get(`/profile/${adminId}`);
    return response;
  } catch (error) {
    console.error("Get admin profile error:", error);
    throw error;
  }
};

export const getMyAdminProfile = async () => adminApi.get("/profile/me");
export const updateMyAdminProfile = async (payload) => {
  const response = await adminApi.patch("/profile/me", payload);
  if (response?.admin) localStorage.setItem("admin_info", JSON.stringify(response.admin));
  return response;
};

export default {
  getAdminProfile,
  getMyAdminProfile,
  updateMyAdminProfile,
};
