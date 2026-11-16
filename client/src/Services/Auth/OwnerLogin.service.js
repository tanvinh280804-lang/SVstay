import { ownerApi, TOKEN_KEYS } from "../../config/axios.config.jsx";

export const OWNER_INFO_KEY = "owner_info";
export const OWNER_PROFILE_CHANGE_EVENT = "svstay:owner-profile-change";

/**
 * Service xử lý đăng nhập cho Chủ trọ
 * @param {Object} payload - { email, password }
 */
export const ownerLogin = async (payload) => {
  try {
    const response = await ownerApi.post("/login", payload);

    if (response?.token) {
      localStorage.setItem(TOKEN_KEYS.OWNER, response.token);
    }

    if (response?.owner) {
      localStorage.setItem(OWNER_INFO_KEY, JSON.stringify(response.owner));
    }

    return response;
  } catch (error) {
    console.error("Owner login error:", error);
    throw error;
  }
};

/**
 * Đăng xuất tài khoản Chủ trọ
 */
export const ownerLogout = () => {
  localStorage.removeItem(TOKEN_KEYS.OWNER);
  localStorage.removeItem(OWNER_INFO_KEY);
};

/**
 * Lấy thông tin Chủ trọ hiện tại từ localStorage
 */
export const getCurrentOwner = () => {
  try {
    const info = localStorage.getItem(OWNER_INFO_KEY);
    return info ? JSON.parse(info) : null;
  } catch {
    return null;
  }
};

/**
 * Kiểm tra xem Chủ trọ đã đăng nhập chưa
 */
export const isOwnerAuthenticated = () => {
  return !!localStorage.getItem(TOKEN_KEYS.OWNER);
};

export const getOwnerProfile = async () => ownerApi.get("/profile/me");

export const updateOwnerProfile = async (payload) => {
  const response = await ownerApi.patch("/profile/me", payload);
  if (response?.owner) {
    localStorage.setItem(OWNER_INFO_KEY, JSON.stringify(response.owner));
    window.dispatchEvent(new Event(OWNER_PROFILE_CHANGE_EVENT));
  }
  return response;
};

export default {
  ownerLogin,
  ownerLogout,
  getCurrentOwner,
  isOwnerAuthenticated,
  getOwnerProfile,
  updateOwnerProfile,
};
