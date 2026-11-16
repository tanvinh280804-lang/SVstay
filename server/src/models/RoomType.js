import mongoose from "mongoose";
import slugify from "slugify";

const roomTypeSchema = new mongoose.Schema({
    type_name: {
        type: String,
        required: [true, "Loại phòng là bắt buộc"],
        unique: [true, "Loại phòng đã tồn tại"],
    },
    type_slug: {
        type: String,
        required: [true, "Slug loại phòng là bắt buộc"],
        unique: [true, "Slug loại phòng đã tồn tại"],
    },
    description: {
        type: String,
        required: [true, "Mô tả loại phòng là bắt buộc"],
    },
    is_active: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

roomTypeSchema.pre('validate', function () {
    if (this.type_name && !this.type_slug) {
        this.type_slug = slugify(this.type_name, { lower: true, strict: true, locale: 'vi' });
    }
});

const RoomType = mongoose.model("RoomType", roomTypeSchema);

export default RoomType;