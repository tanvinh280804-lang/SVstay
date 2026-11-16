import { adminApi } from "../../config/axios.config.jsx";

export const getAdminRooms = (params = {}) => adminApi.get("/rooms", { params });
export const reviewAdminRoom = (roomId, decision) =>
  adminApi.patch(`/rooms/${roomId}/review`, { decision });
