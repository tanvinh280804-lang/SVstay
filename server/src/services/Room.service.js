import mongoose from "mongoose";
import Room from "../models/Room.js";
import RoomType from "../models/RoomType.js";
import Owner from "../models/Owner.js";
import { ROOM_STATUS } from "../constants/Room.constant.js";
import { uploadToCloudinary } from "../config/cloudinary.config.js";
import slugify from "slugify";

/**
 * Tạo slug độc nhất không trùng lặp cho phòng
 */
const generateUniqueSlug = async (roomName, excludeRoomId = null) => {
    let baseSlug = slugify(roomName || "phong-tro", { lower: true, strict: true, locale: "vi" });
    if (!baseSlug) baseSlug = "phong-tro";

    let slug = baseSlug;
    let counter = 1;

    while (true) {
        const query = { room_slug: slug };
        if (excludeRoomId) {
            query._id = { $ne: excludeRoomId };
        }
        const existing = await Room.findOne(query).select("_id");
        if (!existing) {
            return slug;
        }
        slug = `${baseSlug}-${counter}`;
        counter++;
    }
};

/**
 * Chuẩn hóa danh sách tiện ích (amenities) từ FormData hoặc JSON
 */
const parseAmenities = (amenities) => {
    if (!amenities) return [];
    if (Array.isArray(amenities)) return amenities.map((item) => String(item).trim()).filter(Boolean);
    if (typeof amenities === "string") {
        try {
            const parsed = JSON.parse(amenities);
            if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
        } catch {
            // Chuỗi ngăn cách bằng dấu phẩy
            return amenities.split(",").map((item) => item.trim()).filter(Boolean);
        }
    }
    return [];
};

/**
 * 1. Lấy danh sách phòng của Chủ trọ (kèm bộ lọc, tìm kiếm, phân trang)
 */
export const getOwnerRoomsService = async (ownerId, query = {}) => {
    try {
        const {
            search,
            room_type_id,
            status,
            is_active,
            page = 1,
            limit = 10,
            sort = "-createdAt",
        } = query;

        const filter = { owner_id: ownerId };

        // Lọc theo từ khóa tìm kiếm (tên phòng, địa chỉ cụ thể, quận/huyện)
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { room_name: searchRegex },
                { specific_address: searchRegex },
                { district: searchRegex },
                { ward: searchRegex },
            ];
        }

        // Lọc theo loại phòng
        if (room_type_id) {
            filter.room_type_id = room_type_id;
        }

        // Lọc theo trạng thái thuê (pending, available, rented, hidden)
        if (status !== undefined && status !== "") {
            filter.status = Number(status);
        }

        // Lọc theo trạng thái hiển thị
        if (is_active !== undefined && is_active !== "") {
            filter.is_active = is_active === "true" || is_active === true;
        }

        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = parseInt(limit, 10);

        let queryBuilder = Room.find(filter)
            .populate("room_type_id", "type_name type_slug")
            .sort(sort);

        let total = 0;
        let totalPages = 1;

        if (limitNum > 0) {
            total = await Room.countDocuments(filter);
            totalPages = Math.ceil(total / limitNum);
            queryBuilder = queryBuilder.skip((pageNum - 1) * limitNum).limit(limitNum);
        }

        const rooms = await queryBuilder;
        if (limitNum <= 0) {
            total = rooms.length;
        }

        return {
            message: "Lấy danh sách phòng thành công.",
            rooms,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum > 0 ? limitNum : total,
                totalPages: totalPages || 1,
            },
        };
    } catch (error) {
        console.error(`Error in getOwnerRoomsService: ${error.message}`);
        return { error: "Lỗi hệ thống khi lấy danh sách phòng." };
    }
};

/**
 * 2. Lấy thông tin chi tiết một phòng của Chủ trọ
 */
export const getOwnerRoomByIdService = async (ownerId, roomId) => {
    try {
        const room = await Room.findOne({
            _id: roomId,
            owner_id: ownerId,
        }).populate("room_type_id", "type_name type_slug description");

        if (!room) {
            return { error: "Không tìm thấy phòng hoặc bạn không có quyền truy cập." };
        }

        return {
            message: "Lấy chi tiết phòng thành công.",
            room,
        };
    } catch (error) {
        console.error(`Error in getOwnerRoomByIdService: ${error.message}`);
        return { error: "Lỗi hệ thống khi lấy chi tiết phòng." };
    }
};

/**
 * 3. Thêm mới phòng cho Chủ trọ (hỗ trợ upload nhiều ảnh qua Cloudinary)
 */
export const createRoomService = async (ownerId, roomData, files = []) => {
    try {
        const {
            room_name,
            room_type_id,
            description,
            price,
            area,
            max_occupants,
            province,
            district,
            ward,
            specific_address,
            electricity_price = 0,
            water_price = 0,
            deposit = 0,
            available_date,
            is_active = true,
            amenities,
            images: inputImages,
        } = roomData;

        // Kiểm tra các trường bắt buộc
        if (!room_name?.trim()) return { error: "Tên phòng là bắt buộc." };
        if (!room_type_id) return { error: "Vui lòng chọn loại phòng." };
        if (!description?.trim()) return { error: "Mô tả phòng là bắt buộc." };
        if (price === undefined || price === null || price === "" || Number(price) < 0) {
            return { error: "Giá thuê phòng không hợp lệ." };
        }
        if (!area || Number(area) <= 0) return { error: "Diện tích phòng phải lớn hơn 0." };
        if (!max_occupants || Number(max_occupants) <= 0) {
            return { error: "Số người ở tối đa phải lớn hơn 0." };
        }
        if (!province?.trim()) return { error: "Tỉnh/thành phố là bắt buộc." };
        if (!district?.trim()) return { error: "Quận/huyện là bắt buộc." };
        if (!ward?.trim()) return { error: "Phường/xã là bắt buộc." };
        if (!specific_address?.trim()) return { error: "Địa chỉ cụ thể là bắt buộc." };

        // Kiểm tra loại phòng có tồn tại không
        const roomTypeExists = await RoomType.findById(room_type_id);
        if (!roomTypeExists) {
            return { error: "Loại phòng được chọn không tồn tại." };
        }

        // Xử lý upload ảnh nếu có file gửi lên
        let uploadedImages = [];
        if (files && files.length > 0) {
            try {
                const uploadPromises = files.map((file) =>
                    uploadToCloudinary(file.buffer, "svstay/rooms")
                );
                const uploadResults = await Promise.all(uploadPromises);
                uploadedImages = uploadResults.map((item) => item.secure_url);
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return { error: `Lỗi tải ảnh lên Cloudinary: ${uploadError.message}` };
            }
        }

        // Kết hợp ảnh vừa upload và ảnh truyền dạng URL (nếu có)
        let finalImages = [...uploadedImages];
        if (inputImages) {
            if (Array.isArray(inputImages)) {
                finalImages = [...finalImages, ...inputImages];
            } else if (typeof inputImages === "string") {
                try {
                    const parsed = JSON.parse(inputImages);
                    if (Array.isArray(parsed)) finalImages = [...finalImages, ...parsed];
                    else finalImages.push(inputImages);
                } catch {
                    finalImages.push(inputImages);
                }
            }
        }

        // Tự sinh slug duy nhất
        const room_slug = await generateUniqueSlug(room_name.trim());

        // Tạo document phòng mới
        const newRoom = await Room.create({
            room_name: room_name.trim(),
            room_slug,
            owner_id: ownerId,
            room_type_id,
            description: description.trim(),
            price: Number(price),
            area: Number(area),
            max_occupants: Number(max_occupants),
            province: province.trim(),
            district: district.trim(),
            ward: ward.trim(),
            specific_address: specific_address.trim(),
            images: finalImages,
            amenities: parseAmenities(amenities),
            electricity_price: Number(electricity_price) || 0,
            water_price: Number(water_price) || 0,
            deposit: Number(deposit) || 0,
            available_date: available_date ? new Date(available_date) : null,
            // Only an admin review can make a submitted room public.
            status: ROOM_STATUS.PENDING,
            is_active: is_active === "false" || is_active === false ? false : true,
        });

        const populatedRoom = await Room.findById(newRoom._id).populate(
            "room_type_id",
            "type_name type_slug"
        );

        return {
            message: "Thêm phòng mới thành công!",
            room: populatedRoom,
        };
    } catch (error) {
        console.error(`Error in createRoomService: ${error.message}`);
        return { error: "Lỗi hệ thống khi thêm mới phòng." };
    }
};

/**
 * 4. Cập nhật thông tin phòng của Chủ trọ
 */
export const updateRoomService = async (ownerId, roomId, roomData, files = []) => {
    try {
        const existingRoom = await Room.findOne({ _id: roomId, owner_id: ownerId });
        if (!existingRoom) {
            return { error: "Không tìm thấy phòng hoặc bạn không có quyền chỉnh sửa." };
        }

        const updateData = {};

        // Nếu có thay đổi tên phòng -> sinh lại slug mới
        if (roomData.room_name && roomData.room_name.trim() !== existingRoom.room_name) {
            updateData.room_name = roomData.room_name.trim();
            updateData.room_slug = await generateUniqueSlug(updateData.room_name, roomId);
        }

        // Kiểm tra loại phòng nếu có cập nhật
        if (roomData.room_type_id && roomData.room_type_id !== String(existingRoom.room_type_id)) {
            const roomTypeExists = await RoomType.findById(roomData.room_type_id);
            if (!roomTypeExists) {
                return { error: "Loại phòng được chọn không tồn tại." };
            }
            updateData.room_type_id = roomData.room_type_id;
        }

        if (roomData.description !== undefined) updateData.description = roomData.description.trim();
        if (roomData.price !== undefined) updateData.price = Number(roomData.price);
        if (roomData.area !== undefined) updateData.area = Number(roomData.area);
        if (roomData.max_occupants !== undefined) updateData.max_occupants = Number(roomData.max_occupants);
        if (roomData.province !== undefined) updateData.province = roomData.province.trim();
        if (roomData.district !== undefined) updateData.district = roomData.district.trim();
        if (roomData.ward !== undefined) updateData.ward = roomData.ward.trim();
        if (roomData.specific_address !== undefined) updateData.specific_address = roomData.specific_address.trim();
        if (roomData.electricity_price !== undefined) updateData.electricity_price = Number(roomData.electricity_price);
        if (roomData.water_price !== undefined) updateData.water_price = Number(roomData.water_price);
        if (roomData.deposit !== undefined) updateData.deposit = Number(roomData.deposit);
        if (roomData.available_date !== undefined) {
            updateData.available_date = roomData.available_date ? new Date(roomData.available_date) : null;
        }
        // Owner edits never change the moderation state.
        if (roomData.is_active !== undefined) {
            updateData.is_active = roomData.is_active === "true" || roomData.is_active === true;
        }
        if (roomData.amenities !== undefined) {
            updateData.amenities = parseAmenities(roomData.amenities);
        }

        // Xử lý upload ảnh mới
        let newUploadedImages = [];
        if (files && files.length > 0) {
            try {
                const uploadPromises = files.map((file) =>
                    uploadToCloudinary(file.buffer, "svstay/rooms")
                );
                const uploadResults = await Promise.all(uploadPromises);
                newUploadedImages = uploadResults.map((item) => item.secure_url);
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return { error: `Lỗi tải ảnh lên Cloudinary: ${uploadError.message}` };
            }
        }

        // Quản lý ảnh cũ giữ lại (nếu client gửi danh sách existing_images)
        if (roomData.existing_images !== undefined || newUploadedImages.length > 0) {
            let baseImages = [];
            if (roomData.existing_images) {
                if (Array.isArray(roomData.existing_images)) {
                    baseImages = roomData.existing_images;
                } else if (typeof roomData.existing_images === "string") {
                    try {
                        const parsed = JSON.parse(roomData.existing_images);
                        baseImages = Array.isArray(parsed) ? parsed : [roomData.existing_images];
                    } catch {
                        baseImages = [roomData.existing_images];
                    }
                }
            } else if (newUploadedImages.length > 0 && roomData.existing_images === undefined) {
                // Mặc định giữ lại các ảnh hiện có nếu không chỉ định rõ
                baseImages = existingRoom.images || [];
            }
            updateData.images = [...baseImages, ...newUploadedImages];
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $set: updateData },
            { returnDocument: "after", runValidators: true }
        ).populate("room_type_id", "type_name type_slug");

        return {
            message: "Cập nhật phòng thành công!",
            room: updatedRoom,
        };
    } catch (error) {
        console.error(`Error in updateRoomService: ${error.message}`);
        return { error: "Lỗi hệ thống khi cập nhật thông tin phòng." };
    }
};

/**
 * 5. Xóa phòng của Chủ trọ
 */
export const deleteRoomService = async (ownerId, roomId) => {
    try {
        const room = await Room.findOne({ _id: roomId, owner_id: ownerId });
        if (!room) {
            return { error: "Không tìm thấy phòng hoặc bạn không có quyền xóa phòng này." };
        }

        await Room.findByIdAndDelete(roomId);

        return {
            message: "Xóa phòng thành công!",
            roomId,
        };
    } catch (error) {
        console.error(`Error in deleteRoomService: ${error.message}`);
        return { error: "Lỗi hệ thống khi xóa phòng." };
    }
};

/**
 * 6. Thay đổi nhanh trạng thái phòng (status hoặc is_active)
 */
export const toggleRoomStatusService = async (ownerId, roomId, data = {}) => {
    try {
        const room = await Room.findOne({ _id: roomId, owner_id: ownerId });
        if (!room) {
            return { error: "Không tìm thấy phòng hoặc bạn không có quyền cập nhật." };
        }

        const updateData = {};
        if (data.status !== undefined) {
            const requestedStatus = Number(data.status);
            const allowedOwnerStatuses = [ROOM_STATUS.RENTED, ROOM_STATUS.HIDDEN];
            if (room.status === ROOM_STATUS.PENDING || (requestedStatus !== room.status && !allowedOwnerStatuses.includes(requestedStatus))) {
                return { error: "Chỉ Admin mới có thể duyệt và hiển thị phòng." };
            }
            updateData.status = requestedStatus;
        }
        if (data.is_active !== undefined) {
            updateData.is_active = data.is_active === "true" || data.is_active === true;
        }

        const updatedRoom = await Room.findByIdAndUpdate(
            roomId,
            { $set: updateData },
            { returnDocument: "after" }
        ).populate("room_type_id", "type_name type_slug");

        return {
            message: "Cập nhật trạng thái phòng thành công!",
            room: updatedRoom,
        };
    } catch (error) {
        console.error(`Error in toggleRoomStatusService: ${error.message}`);
        return { error: "Lỗi hệ thống khi thay đổi trạng thái phòng." };
    }
};

/**
 * ============================================================
 *                 DÀNH CHO KHÁCH HÀNG (CUSTOMER)
 * ============================================================
 */

/**
 * 7. Lấy danh sách các phòng đang hoạt động (kèm bộ lọc tìm kiếm phong phú cho khách)
 */
export const getActiveRoomsForCustomerService = async (query = {}) => {
    try {
        const {
            search,
            room_type_id,
            room_type_slug,
            province,
            district,
            ward,
            min_price,
            max_price,
            min_area,
            max_area,
            max_occupants,
            amenities,
            status,
            page = 1,
            limit = 12,
            sort = "-createdAt",
        } = query;

        // Điều kiện cốt lõi: phòng phải đang hoạt động và không bị ẩn
        const filter = {
            is_active: true,
            status: ROOM_STATUS.AVAILABLE,
        };

        // Lọc trạng thái (mặc định lấy AVAILABLE nếu không yêu cầu cụ thể)
        // Public/customer queries must never expose pending, rented, or hidden rooms.

        // Tìm kiếm theo từ khóa
        if (search && search.trim()) {
            const searchRegex = new RegExp(search.trim(), "i");
            filter.$or = [
                { room_name: searchRegex },
                { specific_address: searchRegex },
                { district: searchRegex },
                { ward: searchRegex },
                { province: searchRegex },
                { description: searchRegex },
            ];
        }

        // Lọc theo loại phòng (bằng slug hoặc ID)
        if (room_type_slug) {
            const rType = await RoomType.findOne({ type_slug: room_type_slug.trim() }).select("_id");
            if (rType) {
                filter.room_type_id = rType._id;
            } else {
                return {
                    message: "Lấy danh sách phòng thành công.",
                    rooms: [],
                    pagination: { total: 0, page: 1, limit: Number(limit) || 12, totalPages: 0 },
                };
            }
        } else if (room_type_id) {
            filter.room_type_id = room_type_id;
        }

        // Lọc theo vị trí địa lý
        if (province && province.trim()) filter.province = new RegExp(province.trim(), "i");
        if (district && district.trim()) filter.district = new RegExp(district.trim(), "i");
        if (ward && ward.trim()) filter.ward = new RegExp(ward.trim(), "i");

        // Lọc theo khoảng giá
        if ((min_price !== undefined && min_price !== "") || (max_price !== undefined && max_price !== "")) {
            filter.price = {};
            if (min_price !== undefined && min_price !== "") filter.price.$gte = Number(min_price);
            if (max_price !== undefined && max_price !== "") filter.price.$lte = Number(max_price);
        }

        // Lọc theo diện tích
        if ((min_area !== undefined && min_area !== "") || (max_area !== undefined && max_area !== "")) {
            filter.area = {};
            if (min_area !== undefined && min_area !== "") filter.area.$gte = Number(min_area);
            if (max_area !== undefined && max_area !== "") filter.area.$lte = Number(max_area);
        }

        // Lọc theo số lượng người ở tối đa
        if (max_occupants && Number(max_occupants) > 0) {
            filter.max_occupants = { $gte: Number(max_occupants) };
        }

        // Lọc theo tiện ích (yêu cầu phòng có đủ các tiện ích được chọn)
        if (amenities) {
            const amenityList = parseAmenities(amenities);
            if (amenityList.length > 0) {
                filter.amenities = { $all: amenityList };
            }
        }

        // Chuẩn hóa phân trang
        const pageNum = Math.max(1, parseInt(page, 10) || 1);
        const limitNum = Math.max(1, parseInt(limit, 10) || 12);

        // Chuẩn hóa sắp xếp (sort)
        let sortOption = "-createdAt";
        if (sort === "price_asc" || sort === "price") sortOption = "price";
        else if (sort === "price_desc" || sort === "-price") sortOption = "-price";
        else if (sort === "area_desc" || sort === "-area") sortOption = "-area";
        else if (sort === "area_asc" || sort === "area") sortOption = "area";
        else if (sort) sortOption = sort;

        const total = await Room.countDocuments(filter);
        const totalPages = Math.ceil(total / limitNum);

        const rooms = await Room.find(filter)
            .populate("room_type_id", "type_name type_slug")
            .populate("owner_id", "full_name phone_number avatar email")
            .sort(sortOption)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);

        return {
            message: "Lấy danh sách phòng hoạt động thành công.",
            rooms,
            pagination: {
                total,
                page: pageNum,
                limit: limitNum,
                totalPages: totalPages || 1,
            },
        };
    } catch (error) {
        console.error(`Error in getActiveRoomsForCustomerService: ${error.message}`);
        return { error: "Lỗi hệ thống khi tải danh sách phòng." };
    }
};

/**
 * 8. Lấy chi tiết phòng đang hoạt động cho Khách hàng (hỗ trợ cả ObjectId và Slug)
 */
export const getRoomDetailForCustomerService = async (idOrSlug) => {
    try {
        if (!idOrSlug) {
            return { error: "Thiếu mã định danh hoặc slug của phòng." };
        }

        const isObjectId = mongoose.Types.ObjectId.isValid(idOrSlug);
        const filter = {
            is_active: true,
            status: ROOM_STATUS.AVAILABLE,
            ...(isObjectId
                ? { $or: [{ _id: idOrSlug }, { room_slug: idOrSlug }] }
                : { room_slug: idOrSlug }),
        };

        const room = await Room.findOne(filter)
            .populate("room_type_id", "type_name type_slug description")
            .populate("owner_id", "full_name phone_number avatar email address");

        if (!room) {
            return { error: "Phòng không tồn tại hoặc đã tạm dừng hiển thị." };
        }

        // Lấy 4 phòng tương tự cùng khu vực hoặc loại phòng để gợi ý cho khách
        const relatedRooms = await Room.find({
            _id: { $ne: room._id },
            is_active: true,
            status: ROOM_STATUS.AVAILABLE,
            $or: [
                { room_type_id: room.room_type_id?._id || room.room_type_id },
                { district: room.district },
            ],
        })
            .populate("room_type_id", "type_name type_slug")
            .populate("owner_id", "full_name phone_number avatar")
            .limit(4)
            .sort("-createdAt");

        return {
            message: "Lấy chi tiết phòng thành công.",
            room,
            related_rooms: relatedRooms,
        };
    } catch (error) {
        console.error(`Error in getRoomDetailForCustomerService: ${error.message}`);
        return { error: "Lỗi hệ thống khi lấy chi tiết phòng." };
    }
};

export const getRoomsForAdminService = async ({ status, page = 1, limit = 20 } = {}) => {
    try {
        const filter = status === undefined || status === "all" ? {} : { status: Number(status) };
        const pageNum = Math.max(1, Number.parseInt(page, 10) || 1);
        const limitNum = Math.min(100, Math.max(1, Number.parseInt(limit, 10) || 20));
        const [rooms, total] = await Promise.all([
            Room.find(filter)
                .populate("owner_id", "full_name email phone_number")
                .populate("room_type_id", "type_name")
                .sort({ createdAt: -1 })
                .skip((pageNum - 1) * limitNum)
                .limit(limitNum),
            Room.countDocuments(filter),
        ]);
        return { rooms, pagination: { total, page: pageNum, limit: limitNum } };
    } catch (error) {
        console.error("Error in getRoomsForAdminService:", error);
        return { error: "Lỗi hệ thống khi lấy danh sách phòng." };
    }
};

export const reviewRoomService = async (roomId, decision) => {
    if (!["approve", "reject"].includes(decision)) return { error: "Quyết định duyệt không hợp lệ." };
    const room = await Room.findById(roomId);
    if (!room) return { error: "Không tìm thấy phòng." };
    if (room.status !== ROOM_STATUS.PENDING) return { error: "Chỉ có thể duyệt phòng đang chờ duyệt." };
    room.status = decision === "approve" ? ROOM_STATUS.AVAILABLE : ROOM_STATUS.HIDDEN;
    await room.save();
    return { message: decision === "approve" ? "Đã duyệt phòng." : "Đã từ chối phòng.", room };
};

export default {
    getOwnerRoomsService,
    getOwnerRoomByIdService,
    createRoomService,
    updateRoomService,
    deleteRoomService,
    toggleRoomStatusService,
    getActiveRoomsForCustomerService,
    getRoomDetailForCustomerService,
};
