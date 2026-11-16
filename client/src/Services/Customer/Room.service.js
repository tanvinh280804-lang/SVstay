import { customerApi } from "../../config/axios.config.jsx";

/**
 * Lấy danh sách các phòng trọ đang hoạt động cho Customer
 * @param {Object} params - { search, room_type_id, room_type_slug, province, district, min_price, max_price, min_area, max_area, page, limit, sort }
 */
export const getActiveRooms = async (params = {}) => {
  try {
    const response = await customerApi.get("/rooms", { params });
    return response;
  } catch (error) {
    console.error("Error fetching active rooms for customer:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết một phòng trọ cho Customer (hỗ trợ cả _id hoặc room_slug)
 * @param {string} idOrSlug - _id hoặc room_slug
 */
export const getRoomDetail = async (idOrSlug) => {
  try {
    const response = await customerApi.get(`/rooms/${idOrSlug}`);
    return response;
  } catch (error) {
    console.error(`Error fetching room detail [${idOrSlug}]:`, error);
    throw error;
  }
};

/**
 * Lấy danh sách loại phòng để lọc
 */
export const getRoomTypes = async () => {
  try {
    const response = await customerApi.get("/room-types");
    return response?.roomType || response?.roomTypes || response?.data || [];
  } catch (error) {
    console.error("Error fetching room types for customer:", error);
    return [];
  }
};

export default {
  getActiveRooms,
  getRoomDetail,
  getRoomTypes,
};
