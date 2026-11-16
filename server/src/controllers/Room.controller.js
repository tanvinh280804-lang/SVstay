import * as RoomService from "../services/Room.service.js";

export const getRoomsForAdmin = async (req, res) => {
    try {
        const result = await RoomService.getRoomsForAdminService(req.query);
        if (result.error) return res.status(500).json({ message: result.error });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in getRoomsForAdmin:", error);
        return res.status(500).json({ message: "Không thể tải danh sách phòng." });
    }
};

export const reviewRoom = async (req, res) => {
    try {
        const result = await RoomService.reviewRoomService(req.params.roomId, req.body?.decision);
        if (result.error) return res.status(400).json({ message: result.error });
        return res.status(200).json(result);
    } catch (error) {
        console.error("Error in reviewRoom:", error);
        return res.status(500).json({ message: "Không thể cập nhật trạng thái duyệt phòng." });
    }
};

/**
 * Lấy danh sách phòng của Chủ trọ đang đăng nhập
 * GET /api/owner/rooms
 */
export const getOwnerRooms = async (req, res) => {
    try {
        const ownerId = req.owner?._id || req.user?.id;
        const result = await RoomService.getOwnerRoomsService(ownerId, req.query);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error in getOwnerRooms controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi lấy danh sách phòng.",
        });
    }
};

/**
 * Lấy thông tin chi tiết một phòng của Chủ trọ
 * GET /api/owner/rooms/:roomId
 */
export const getOwnerRoomById = async (req, res) => {
    try {
        const ownerId = req.owner?._id || req.user?.id;
        const { roomId } = req.params;

        const result = await RoomService.getOwnerRoomByIdService(ownerId, roomId);

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error in getOwnerRoomById controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi lấy chi tiết phòng.",
        });
    }
};

/**
 * Thêm mới phòng trọ cho Chủ trọ (kèm upload ảnh)
 * POST /api/owner/rooms
 */
export const createNewRoom = async (req, res) => {
    try {
        const ownerId = req.owner?._id || req.user?.id;
        const roomData = req.body;
        const files = req.files || [];

        const result = await RoomService.createRoomService(ownerId, roomData, files);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(201).json(result);
    } catch (error) {
        console.error(`Error in createNewRoom controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi thêm mới phòng.",
        });
    }
};

/**
 * Cập nhật thông tin phòng trọ của Chủ trọ
 * PUT /api/owner/rooms/:roomId hoặc PATCH /api/owner/rooms/:roomId
 */
export const updateRoom = async (req, res) => {
    try {
        const ownerId = req.owner?._id || req.user?.id;
        const { roomId } = req.params;
        const roomData = req.body;
        const files = req.files || [];

        const result = await RoomService.updateRoomService(ownerId, roomId, roomData, files);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error in updateRoom controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi cập nhật phòng.",
        });
    }
};

/**
 * Xóa phòng trọ của Chủ trọ
 * DELETE /api/owner/rooms/:roomId
 */
export const deleteRoom = async (req, res) => {
    try {
        const ownerId = req.owner?._id || req.user?.id;
        const { roomId } = req.params;

        const result = await RoomService.deleteRoomService(ownerId, roomId);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error in deleteRoom controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi xóa phòng.",
        });
    }
};

/**
 * Thay đổi nhanh trạng thái phòng (status hoặc is_active)
 * PATCH /api/owner/rooms/:roomId/status
 */
export const toggleRoomStatus = async (req, res) => {
    try {
        const ownerId = req.owner?._id || req.user?.id;
        const { roomId } = req.params;
        const data = req.body;

        const result = await RoomService.toggleRoomStatusService(ownerId, roomId, data);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error in toggleRoomStatus controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi thay đổi trạng thái phòng.",
        });
    }
};

/**
 * ============================================================
 *                 CONTROLLER DÀNH CHO KHÁCH HÀNG
 * ============================================================
 */

/**
 * Lấy danh sách các phòng đang hoạt động cho Khách hàng
 * GET /api/customer/rooms
 */
export const getActiveRoomsForCustomer = async (req, res) => {
    try {
        const result = await RoomService.getActiveRoomsForCustomerService(req.query);

        if (result.error) {
            return res.status(400).json({ message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error in getActiveRoomsForCustomer controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi lấy danh sách phòng.",
        });
    }
};

/**
 * Lấy chi tiết phòng đang hoạt động cho Khách hàng (hỗ trợ cả id và slug)
 * GET /api/customer/rooms/:idOrSlug
 */
export const getRoomDetailForCustomer = async (req, res) => {
    try {
        const { idOrSlug, roomId, slug } = req.params;
        const identifier = idOrSlug || roomId || slug;

        const result = await RoomService.getRoomDetailForCustomerService(identifier);

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        return res.status(200).json(result);
    } catch (error) {
        console.error(`Error in getRoomDetailForCustomer controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi lấy chi tiết phòng.",
        });
    }
};

export default {
    getOwnerRooms,
    getOwnerRoomById,
    createNewRoom,
    updateRoom,
    deleteRoom,
    toggleRoomStatus,
    getActiveRoomsForCustomer,
    getRoomDetailForCustomer,
};
