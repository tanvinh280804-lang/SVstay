import "dotenv/config";
import RoomType from "../models/RoomType.js";
import connectDB from "../config/database.config.js";
import mongoose from "mongoose";
import { fileURLToPath } from "url";

const defaultRoomTypes = [

    {
        type_name: "Căn hộ Studio mini",
        type_slug: "can-ho-studio-mini",
        description: "Căn hộ diện tích từ 25m² - 35m² tích hợp không gian mở hiện đại, đầy đủ nội thất cao cấp: giường, tủ, sofa, bếp từ, máy giặt riêng.",
        isActive: true,
    },
    {
        type_name: "Chung cư mini 1 phòng ngủ",
        type_slug: "chung-cu-mini-1-phong-ngu",
        description: "Căn hộ chung cư mini gồm 1 phòng ngủ riêng biệt, phòng khách liền bếp, ban công thoáng mát, phù hợp cho nhóm 2 người.",
        isActive: true,
    },
    {
        type_name: "Chung cư mini 2 phòng ngủ",
        type_slug: "chung-cu-mini-2-phong-ngu",
        description: "Căn hộ chung cư mini gồm 2 phòng ngủ tách biệt, phòng khách rộng rãi, thích hợp cho nhóm sinh viên hoặc hộ gia đình nhỏ 3-4 người.",
        isActive: true,
    },
    {
        type_name: "Căn hộ dịch vụ cao cấp",
        type_slug: "can-ho-dich-vu-cao-cap",
        description: "Căn hộ đầy đủ tiện nghi với dịch vụ dọn phòng, giặt sấy, thang máy, bảo vệ trực 24/7 và hệ thống camera an ninh nghiêm ngặt.",
        isActive: true,
    },
    {
        type_name: "Nhà nguyên căn (Share house)",
        type_slug: "nha-nguyen-can-share-house",
        description: "Phòng ngủ riêng biệt trong nhà nguyên căn nhiều tầng, dùng chung phòng bếp lớn, phòng khách và sân thượng phơi đồ.",
        isActive: true,
    },
    {
        type_name: "Phòng trọ cao cấp Full nội thất",
        type_slug: "phong-tro-cao-cap-full-noi-that",
        description: "Phòng trọ trang bị sẵn điều hòa Inverter, bình nóng lạnh, tủ lạnh, giường nệm, bàn ghế học tập, chỉ cần dọn vali vào ở.",
        isActive: true,
    },
    {
        type_name: "Phòng trọ ở ghép sinh viên",
        type_slug: "phong-tro-o-ghep-sinh-vien",
        description: "Không gian phòng trọ tiện ích dành cho các bạn sinh viên có nhu cầu tìm bạn cùng phòng để chia sẻ chi phí sinh hoạt.",
        isActive: true,
    },
    {
        type_name: "Căn hộ Penthouse mini / Duplex",
        type_slug: "can-ho-penthouse-mini-duplex",
        description: "Căn hộ tầng áp mái hoặc dạng thông tầng (Duplex) thiết kế phong cách trẻ trung, có view đẹp và ban công cây xanh thoáng đãng.",
        isActive: true,
    },
    {
        type_name: "Phòng trọ Homestay sinh viên",
        type_slug: "phong-tro-homestay-sinh-vien",
        description: "Mô hình phòng trọ mang phong cách homestay trẻ trung, không gian decor thẩm mỹ, khu sinh hoạt chung giao lưu văn hóa năng động.",
        isActive: true,
    }
];

const RoomTypeSeeder = async () => {
    try {
        let insertedCount = 0;
        let skippedCount = 0;

        for (const item of defaultRoomTypes) {
            const existingType = await RoomType.findOne({
                $or: [
                    { type_name: item.type_name },
                    { type_slug: item.type_slug }
                ]
            });

            if (existingType) {
                skippedCount++;
                continue;
            }

            await RoomType.create(item);
            insertedCount++;
        }

        console.log(`RoomType seeder completed: ${insertedCount} added, ${skippedCount} already existed.`);
    } catch (error) {
        console.error("Error seeding RoomType:", error);
        throw error;
    }
};

// Allow standalone execution: node src/seeders/RoomType.seeder.js
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
    (async () => {
        try {
            await connectDB();
            await RoomTypeSeeder();
        } catch (error) {
            console.error("Standalone seeding failed:", error);
            process.exit(1);
        } finally {
            await mongoose.connection.close();
            process.exit(0);
        }
    })();
}

export default RoomTypeSeeder;

