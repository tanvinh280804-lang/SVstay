import { adminApi } from "../../config/axios.config.jsx";

export const getUsers = (type, params = {}) => adminApi.get(`/users/${type}`, { params });
export const setUserStatus = (type, userId, is_active) =>
  adminApi.patch(`/users/${type}/${userId}/status`, { is_active });
