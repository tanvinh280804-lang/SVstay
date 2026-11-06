import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
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
    }
    

}, { timestamps: true });