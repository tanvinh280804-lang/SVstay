import RoomType from "../models/RoomType.js";

export const getAllRoomTypesService = async () => {
    try {
        const roomType = await RoomType.find();
        if(!roomType) {
            return { error: "Không tìm thấy loại phòng nào." };
        }
        return { roomType };
    }
    catch (error) {
        console.log(`Error in getAllRoomTypesService: ${error.message}`);
        return { error: "Lỗi hệ thống khi lấy danh sách loại phòng." };
    }
}