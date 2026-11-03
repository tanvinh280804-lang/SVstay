import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { ADMIN_ROLE, ADMIN_ISACTIVE } from "../constants/Admin.constant.js";

const adminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Tên đăng nhập là bắt buộc"],
        trim: true
    },
    password: {
        type: String,
        required: [true, "Mật khẩu là bắt buộc"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email là bắt buộc"],
        trim: true,
        example: [/\S+@\S+\.\S+/, "Email không hợp lệ"]
    },
    avatar_url: {
        type: String,
        trim: true
    },
    phone: {
        type: String,
        required: [true, "Số điện thoại là bắt buộc"],
        trim: true
    },
    role: {
        type: Number,
        enum: [ADMIN_ROLE.ADMIN, ADMIN_ROLE.SUPERADMIN],
        default: ADMIN_ROLE.ADMIN
    },
    isActive: {
        type: Number,
        enum: [ADMIN_ISACTIVE.ACTIVE, ADMIN_ISACTIVE.INACTIVE, ADMIN_ISACTIVE.BANNED],
        default: ADMIN_ISACTIVE.ACTIVE
    }

}, { timestamps: true });

adminSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = function (password) {
    return bcrypt.compare(password, this.password);
}

const Admin = mongoose.model("Admin", adminSchema);

export default Admin;