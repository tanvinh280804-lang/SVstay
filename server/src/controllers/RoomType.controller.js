import console from "console";
import * as RoomTypeService from "../services/RoomType.service.js";

export const getAllRoomTypes = async (req, res) => {
    try {
        const result = await RoomTypeService.getAllRoomTypesService();

        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        return res.status(200).json({
            message: "Lấy danh sách loại phòng thành công.",
            ...result
        });
    }
    catch (error) {
        console.log(`Error in getAllRoomTpyes controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi lấy danh sách loại phòng."
        });
    }
};

export const addNewRoomType = async (req, res) => {
    try {
        const roomType = req.body;
        const result = await RoomTypeService.addNewRoomTypeService(roomType);
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        return res.status(200).json({
            ...result
        });
    }
    catch (error) {
        console.log(`Error in addNewRoomType controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi thêm loại phòng."
        });
    }
}

export const removeRoomType = async (req, res) => {
    try {
        const { roomTypeId } = req.params;
        const result = await RoomTypeService.removeRoomTypeService(roomTypeId);
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        return res.status(200).json({
            ...result
        });
    }
    catch (error) {
        console.log(`Error in removeRoomType controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi xóa loại phòng."
        });
    }
}

export const updateRoomType = async (req, res) => {
    try {
        const { roomTypeId } = req.params;
        const roomType = req.body;
        const result = await RoomTypeService.updateRoomTypeService(roomTypeId, roomType);
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        return res.status(200).json({
            ...result
        });
    }
    catch (error) {
        console.log(`Error in updateRoomType controller: ${error.message}`);
        return res.status(500).json({
            message: "Lỗi hệ thống khi cập nhật loại phòng."
        });
    }
}