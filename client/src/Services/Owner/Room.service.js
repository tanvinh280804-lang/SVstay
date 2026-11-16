import { ownerApi } from "../../config/axios.config.jsx";

/**
 * Lấy danh sách phòng của Chủ trọ đang đăng nhập
 * @param {Object} params - { search, status, room_type_id, min_price, max_price, page, limit, sort }
 */
export const getOwnerRooms = async (params = {}) => {
  try {
    const response = await ownerApi.get("/rooms", { params });
    return response;
  } catch (error) {
    console.error("Error fetching owner rooms:", error);
    throw error;
  }
};

/**
 * Lấy chi tiết phòng của Chủ trọ
 * @param {string} roomId
 */
export const getOwnerRoomById = async (roomId) => {
  try {
    const response = await ownerApi.get(`/rooms/${roomId}`);
    return response;
  } catch (error) {
    console.error(`Error fetching owner room by id [${roomId}]:`, error);
    throw error;
  }
};

/**
 * Thêm mới phòng trọ (hỗ trợ FormData cho upload ảnh)
 * @param {FormData|Object} roomData
 */
export const createRoom = async (roomData) => {
  try {
    const isFormData = roomData instanceof FormData;
    const response = await ownerApi.post("/rooms", roomData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response;
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
};

/**
 * Cập nhật thông tin phòng trọ
 * @param {string} roomId
 * @param {FormData|Object} roomData
 */
export const updateRoom = async (roomId, roomData) => {
  try {
    const isFormData = roomData instanceof FormData;
    const response = await ownerApi.put(`/rooms/${roomId}`, roomData, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return response;
  } catch (error) {
    console.error(`Error updating room [${roomId}]:`, error);
    throw error;
  }
};

/**
 * Cập nhật nhanh trạng thái phòng (status hoặc is_active)
 * @param {string} roomId
 * @param {Object} statusData - { status, is_active }
 */
export const toggleRoomStatus = async (roomId, statusData) => {
  try {
    const response = await ownerApi.patch(`/rooms/${roomId}/status`, statusData);
    return response;
  } catch (error) {
    console.error(`Error toggling room status [${roomId}]:`, error);
    throw error;
  }
};

/**
 * Xóa phòng của Chủ trọ
 * @param {string} roomId
 */
export const deleteRoom = async (roomId) => {
  try {
    const response = await ownerApi.delete(`/rooms/${roomId}`);
    return response;
  } catch (error) {
    console.error(`Error deleting room [${roomId}]:`, error);
    throw error;
  }
};

/**
 * Lấy danh sách loại phòng để chọn khi tạo/sửa phòng
 */
export const getRoomTypes = async () => {
  try {
    const response = await ownerApi.get("/room-types");
    return response?.roomType || response?.roomTypes || response?.data || [];
  } catch (error) {
    console.error("Error fetching room types for owner:", error);
    return [];
  }
};

export default {
  getOwnerRooms,
  getOwnerRoomById,
  createRoom,
  updateRoom,
  toggleRoomStatus,
  deleteRoom,
  getRoomTypes,
};
