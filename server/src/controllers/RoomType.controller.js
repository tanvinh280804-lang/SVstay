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
}