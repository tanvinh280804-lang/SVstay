import RoomType from "../models/RoomType.js";

export const getAllRoomTypesService = async () => {
    try {
        const roomType = await RoomType.find();
        if (!roomType) {
            return { error: "Không tìm thấy loại phòng nào." };
        }
        return { roomType };
    }
    catch (error) {
        console.log(`Error in getAllRoomTypesService: ${error.message}`);
        return { error: "Lỗi hệ thống khi lấy danh sách loại phòng." };
    }
}

export const addNewRoomTypeService = async (roomType) => {
    try {
        const { type_name, type_slug, description } = roomType;

        const existingRoomType = await RoomType.findOne({
            $or: [
                { type_name: type_name },
                { type_slug: type_slug }
            ]
        });

        if (existingRoomType) {
            return { error: "Tên hoặc slug loại phòng đã tồn tại." };
        }

        const newRoomType = await RoomType.create({
            type_name: type_name,
            type_slug: type_slug,
            description
        });

        return {
            message: "Thêm mới loại phòng thành công!",
            roomType: newRoomType,
        };
    }
    catch (error) {
        console.log(`Error in addNewRoomTypeService: ${error.message}`);
        return { error: "Lỗi hệ thống khi thêm loại phòng." };
    }
}

export const removeRoomTypeService = async (roomTypeId) => {
    try {
        const removedRoomType = await RoomType.findByIdAndDelete({ _id: roomTypeId });
        if (!removedRoomType) {
            return { error: "Loại phòng không tồn tại." }
        }
        return {
            message: "Xóa loại phòng thành công!",
            removedRoomType: removedRoomType,
        }
    }
    catch (error) {
        console.log(`Error in removeRoomTypeService: ${error.message}`);
        return { error: "Lỗi hệ thống khi xóa loại phòng." };
    }
}

export const updateRoomTypeService = async (roomTypeId, roomType) => {
    try {
        const { type_name, type_slug, description } = roomType;

        const existingRoomType = await RoomType.findOne({
            $or: [
                { type_name },
                { type_slug }
            ],
            _id: { $ne: roomTypeId }

        })

        if (existingRoomType) {
            return { error: "Tên loại phòng dã tồn tại." }
        }

        const updatedRoomType = await RoomType.findOneAndUpdate(
            { _id: roomTypeId },
            {
                type_name,
                type_slug,
                description
            },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        return {
            message: "Cập nhật loại phòng thành công.",
            updatedRoomType: updatedRoomType
        }

    }
    catch (error) {
        console.log(`Error in removeRoomTypeService: ${error.message}`);
        return { error: "Lỗi hệ thống khi xóa loại phòng." };
    }
}