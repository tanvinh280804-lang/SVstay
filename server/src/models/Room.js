import mongoose from "mongoose";
import slugify from "slugify";
import { ROOM_STATUS } from "../constants/Room.constant.js"

const roomSchema = new mongoose.Schema({
    room_name: {
        type: String,
        required: [true, "Tên phòng là bắt buộc"],
        trim: true,
    },

    room_slug: {
        type: String,
        required: [true, "Slug phòng là bắt buộc"],
        unique: true,
        trim: true,
    },

    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Owner",
        required: [true, "Chủ trọ là bắt buộc"],
    },

    room_type_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RoomType",
        required: [true, "Loại phòng là bắt buộc"],
    },

    description: {
        type: String,
        required: [true, "Mô tả phòng là bắt buộc"],
        trim: true,
    },

    price: {
        type: Number,
        required: [true, "Giá thuê là bắt buộc"],
        min: [0, "Giá thuê không hợp lệ"],
    },

    area: {
        type: Number,
        required: [true, "Diện tích là bắt buộc"],
        min: [1, "Diện tích phải lớn hơn 0"],
    },

    max_occupants: {
        type: Number,
        required: [true, "Số người ở tối đa là bắt buộc"],
        min: [1, "Số người phải lớn hơn 0"],
    },

    province: {
        type: String,
        required: [true, "Tỉnh/thành phố là bắt buộc"],
        trim: true,
    },

    district: {
        type: String,
        required: [true, "Quận/huyện là bắt buộc"],
        trim: true,
    },

    ward: {
        type: String,
        required: [true, "Phường/xã là bắt buộc"],
        trim: true,
    },

    specific_address: {
        type: String,
        required: [true, "Địa chỉ cụ thể là bắt buộc"],
        trim: true,
    },

    images: {
        type: [String],
        default: [],
    },

    amenities: {
        type: [String],
        default: [],
    },

    electricity_price: {
        type: Number,
        default: 0,
        min: 0,
    },

    water_price: {
        type: Number,
        default: 0,
        min: 0,
    },

    deposit: {
        type: Number,
        default: 0,
        min: 0,
    },

    available_date: {
        type: Date,
        default: null,
    },

    status: {
        type: Number,
        enum: {
            values: [ROOM_STATUS.PENDING, ROOM_STATUS.AVAILABLE, ROOM_STATUS.RENTED, ROOM_STATUS.HIDDEN],
            message: "Trạng thái phòng không hợp lệ",
        },
        default: ROOM_STATUS.PENDING,
    },

    is_active: {
        type: Boolean,
        default: true,
    },

}, { timestamps: true });

roomSchema.pre('validate', function () {
    if (this.room_name && !this.room_slug) {
        this.room_slug = slugify(this.room_name, { lower: true, strict: true, locale: 'vi' });
    }
});

const Room = mongoose.model("Room", roomSchema);

export default Room;
