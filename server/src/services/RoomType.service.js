import RoomType from "../models/RoomType";

export const getAllRoomTypesService = async () => {
    try {
        const roomType = await RoomType.find();
        if(!roomType) {
            return { error: "Không tìm thấy loại phòng nào." };
        }
        return { roomType };
    }
    catch (error) {
        console.log(error);
        return { error: "Lỗi hệ thống" };
    }
}