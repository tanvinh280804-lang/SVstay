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

export default {
  getAdminProfile,
};
