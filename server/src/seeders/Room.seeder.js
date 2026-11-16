import "dotenv/config";
import Room from "../models/Room.js";
import Owner from "../models/Owner.js";
import RoomType from "../models/RoomType.js";
import { ROOM_STATUS } from "../constants/Room.constant.js";
import connectDB from "../config/database.config.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { resolve } from "path";

const defaultRooms = [
    {
        room_name: "Studio A01 - Hải Châu",
        room_type_slug: "can-ho-studio-mini",
        description: "Căn hộ Studio thiết kế không gian mở hiện đại, đầy đủ nội thất, phù hợp cho cá nhân hoặc cặp đôi.",
        price: 4500000,
        area: 30,
        max_occupants: 2,
        province: "Đà Nẵng",
        district: "Hải Châu",
        ward: "Hải Châu",
        specific_address: "Đường Nguyễn Văn Linh",
        images: [],
        amenities: ["Máy lạnh", "Giường", "Tủ quần áo", "Bếp", "Wifi"],
        electricity_price: 3500,
        water_price: 15000,
        deposit: 4500000,
        available_date: new Date(),
        status: ROOM_STATUS.AVAILABLE,
        is_active: true,
    },
    {
        room_name: "Chung cư mini B02 - Sơn Trà",
        room_type_slug: "chung-cu-mini-1-phong-ngu",
        description: "Căn hộ mini có một phòng ngủ riêng biệt, phòng khách liền bếp, không gian thoáng mát và đầy đủ tiện nghi.",
        price: 5500000,
        area: 40,
        max_occupants: 2,
        province: "Đà Nẵng",
        district: "Sơn Trà",
        ward: "An Hải",
        specific_address: "Đường Ngô Quyền",
        images: [],
        amenities: ["Máy lạnh", "Máy giặt", "Tủ lạnh", "Ban công", "Wifi"],
        electricity_price: 3500,
        water_price: 15000,
        deposit: 5500000,
        available_date: new Date(),
        status: ROOM_STATUS.AVAILABLE,
        is_active: true,
    },
    {
        room_name: "Chung cư mini C03 - Ngũ Hành Sơn",
        room_type_slug: "chung-cu-mini-2-phong-ngu",
        description: "Căn hộ gồm hai phòng ngủ riêng biệt, phòng khách rộng rãi, phù hợp cho gia đình nhỏ hoặc nhóm sinh viên.",
        price: 7500000,
        area: 60,
        max_occupants: 4,
        province: "Đà Nẵng",
        district: "Ngũ Hành Sơn",
        ward: "Mỹ An",
        specific_address: "Đường Lê Văn Hiến",
        images: [],
        amenities: ["Máy lạnh", "Máy giặt", "Tủ lạnh", "Bếp", "Ban công", "Wifi"],
        electricity_price: 3500,
        water_price: 15000,
        deposit: 7500000,
        available_date: new Date(),
        status: ROOM_STATUS.AVAILABLE,
        is_active: true,
    },
    {
        room_name: "Căn hộ dịch vụ D04 - Thanh Khê",
        room_type_slug: "can-ho-dich-vu-cao-cap",
        description: "Căn hộ dịch vụ cao cấp với đầy đủ nội thất, không gian riêng tư và hệ thống an ninh đảm bảo.",
        price: 6800000,
        area: 45,
        max_occupants: 2,
        province: "Đà Nẵng",
        district: "Thanh Khê",
        ward: "Vĩnh Trung",
        specific_address: "Đường Điện Biên Phủ",
        images: [],
        amenities: ["Máy lạnh", "Máy giặt", "Tủ lạnh", "Thang máy", "Camera", "Wifi"],
        electricity_price: 3500,
        water_price: 15000,
        deposit: 6800000,
        available_date: new Date(),
        status: ROOM_STATUS.AVAILABLE,
        is_active: true,
    },
    {
        room_name: "Nhà nguyên căn E05 - Liên Chiểu",
        room_type_slug: "nha-nguyen-can-share-house",
        description: "Phòng ngủ riêng trong nhà nguyên căn rộng rãi, sử dụng chung phòng khách, nhà bếp và khu vực sinh hoạt.",
        price: 3000000,
        area: 25,
        max_occupants: 2,
        province: "Đà Nẵng",
        district: "Liên Chiểu",
        ward: "Hòa Khánh",
        specific_address: "Đường Âu Cơ",
        images: [],
        amenities: ["Giường", "Tủ quần áo", "Bếp chung", "Máy giặt", "Wifi"],
        electricity_price: 3500,
        water_price: 15000,
        deposit: 3000000,
        available_date: new Date(),
        status: ROOM_STATUS.AVAILABLE,
        is_active: true,
    },
    {
        room_name: "Phòng trọ F06 - Cẩm Lệ",
        room_type_slug: "phong-tro-cao-cap-full-noi-that",
        description: "Phòng trọ đầy đủ nội thất, thiết kế hiện đại, chỉ cần mang theo hành lý cá nhân là có thể sinh hoạt.",
        price: 3800000,
        area: 28,
        max_occupants: 2,
        province: "Đà Nẵng",
        district: "Cẩm Lệ",
        ward: "Hòa Xuân",
        specific_address: "Đường Cách Mạng Tháng Tám",
        images: [],
        amenities: ["Máy lạnh", "Giường", "Tủ lạnh", "Máy nước nóng", "Bàn học", "Wifi"],
        electricity_price: 3500,
        water_price: 15000,
        deposit: 3800000,
        available_date: new Date(),
        status: ROOM_STATUS.RENTED,
        is_active: true,
    },
    {
        room_name: "Phòng ở ghép G07 - Liên Chiểu",
        room_type_slug: "phong-tro-o-ghep-sinh-vien",
        description: "Phòng trọ dành cho sinh viên, không gian thoáng mát, chi phí hợp lý, phù hợp với nhu cầu ở ghép.",
        price: 1200000,
        area: 24,
        max_occupants: 4,
        province: "Đà Nẵng",
        district: "Liên Chiểu",
        ward: "Hòa Khánh",
        specific_address: "Đường Nguyễn Lương Bằng",
        images: [],
        amenities: ["Giường tầng", "Tủ cá nhân", "Máy lạnh", "Wifi", "Nhà vệ sinh riêng"],
        electricity_price: 3500,
        water_price: 15000,
        deposit: 1200000,
        available_date: null,
        status: ROOM_STATUS.AVAILABLE,
        is_active: true,
    },
    {
        room_name: "Căn hộ Duplex H08 - Ngũ Hành Sơn",
        room_type_slug: "can-ho-penthouse-mini-duplex",
        description: "Căn hộ Duplex thiết kế thông tầng độc đáo, không gian rộng rãi, ban công thoáng đãng và nội thất hiện đại.",
        price: 8500000,
        area: 65,
        max_occupants: 3,
        province: "Đà Nẵng",
        district: "Ngũ Hành Sơn",
        ward: "Mỹ An",
        specific_address: "Đường Châu Thị Vĩnh Tế",
        images: [],
        amenities: ["Máy lạnh", "Máy giặt", "Tủ lạnh", "Bếp", "Ban công", "Wifi"],
        electricity_price: 3500,
        water_price: 15000,
        deposit: 8500000,
        available_date: null,
        status: ROOM_STATUS.RENTED,
        is_active: true,
    },
    {
        room_name: "Phòng Homestay I09 - Hải Châu",
        room_type_slug: "phong-tro-homestay-sinh-vien",
        description: "Phòng trọ phong cách Homestay, được trang trí trẻ trung, không gian sinh hoạt chung thân thiện và tiện nghi.",
        price: 2800000,
        area: 22,
        max_occupants: 2,
        province: "Đà Nẵng",
        district: "Hải Châu",
        ward: "Thạch Thang",
        specific_address: "Đường Đống Đa",
        images: [],
        amenities: ["Giường", "Tủ quần áo", "Máy lạnh", "Wifi", "Khu sinh hoạt chung"],
        electricity_price: 3500,
        water_price: 15000,
        deposit: 2800000,
        available_date: new Date(),
        status: ROOM_STATUS.PENDING,
        is_active: true,
    },
];

const RoomSeeder = async () => {
    try {
        let insertedCount = 0;
        let skippedCount = 0;

        // Lấy danh sách chủ trọ
        const owners = await Owner.find().sort({ createdAt: 1 });

        if (owners.length === 0) {
            throw new Error("Không tìm thấy chủ trọ. Vui lòng tạo Owner trước khi chạy Room Seeder.");
        }

        // Lấy danh sách loại phòng
        const roomTypeSlugs = [...new Set(
            defaultRooms.map((item) => item.room_type_slug)
        )];

        const roomTypes = await RoomType.find({
            type_slug: { $in: roomTypeSlugs },
        });

        // Tạo Map để tra cứu RoomType theo slug
        const roomTypeMap = new Map(
            roomTypes.map((item) => [item.type_slug, item])
        );

        // Kiểm tra loại phòng còn thiếu
        const missingTypes = roomTypeSlugs.filter(
            (slug) => !roomTypeMap.has(slug)
        );

        if (missingTypes.length > 0) {
            throw new Error(
                `Không tìm thấy các loại phòng: ${missingTypes.join(", ")}. Vui lòng chạy RoomType Seeder trước.`
            );
        }

        // Tiến hành tạo dữ liệu phòng
        for (let i = 0; i < defaultRooms.length; i++) {
            const item = defaultRooms[i];

            // Kiểm tra phòng đã tồn tại
            const existingRoom = await Room.findOne({
                room_name: item.room_name,
            });

            if (existingRoom) {
                skippedCount++;
                continue;
            }

            // Phân bổ chủ trọ luân phiên
            const owner = owners[i % owners.length];

            // Lấy loại phòng tương ứng
            const roomType = roomTypeMap.get(item.room_type_slug);

            // Loại bỏ trường trung gian room_type_slug
            const { room_type_slug, ...roomData } = item;

            await Room.create({
                ...roomData,
                owner_id: owner._id,
                room_type_id: roomType._id,
            });

            insertedCount++;
        }

        console.log(
            `Room seeder completed: ${insertedCount} added, ${skippedCount} already existed.`
        );

    } catch (error) {
        console.error("Error seeding Room:", error);
        throw error;
    }
};

// Allow standalone execution: node src/seeders/Room.seeder.js
if (
    process.argv[1] &&
    fileURLToPath(import.meta.url) === resolve(process.argv[1])
) {
    (async () => {
        try {
            await connectDB();
            await RoomSeeder();
        } catch (error) {
            console.error("Standalone seeding failed:", error);
            process.exitCode = 1;
        } finally {
            if (mongoose.connection.readyState !== 0) {
                await mongoose.connection.close();
            }
        }
    })();
}

export default RoomSeeder;
