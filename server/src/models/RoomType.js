import mongoose from "mongoose";

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
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

roomTypeSchema.pre('validate', function () {
    if (this.type_name && (!this.type_slug || this.isModified('type_name'))) {
        this.type_slug = this.type_name.toLowerCase().replace(/\s+/g, '-');
    }
});

const RoomType = mongoose.model("RoomType", roomTypeSchema);

export default RoomType;