import { adminApi } from "../../config/axios.config.jsx";

/**
 * Service lấy danh sách các loại phòng cho Admin
 * @returns {Promise<Object>} { message: string, roomType: Array }
 */
export const getAllRoomTypes = async () => {
  try {
    const response = await adminApi.get("/room-types");
    return response;
  } catch (error) {
    console.error("Get all room types error:", error);
    throw error;
  }
};

/**
 * Service thêm mới loại phòng
 * @param {Object} roomTypeData { type_name: string, description: string, type_slug?: string }
 * @returns {Promise<Object>} { message: string, roomType: Object }
 */
export const createRoomType = async (roomTypeData) => {
  try {
    const response = await adminApi.post("/room-types", roomTypeData);
    return response;
  } catch (error) {
    console.error("Create room type error:", error);
    throw error;
  }
};

export default {
  getAllRoomTypes,
  createRoomType,
};
