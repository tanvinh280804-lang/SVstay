import Admin from "../models/Admin.js";
import Owner from "../models/Owner.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ADMIN_ISACTIVE } from "../constants/Admin.constant.js";

export const adminLoginService = async (username, password) => {
    try {
        let admin = await Admin.findOne({ username });
        if (!admin) {
            return { error: "Tài khoản Admin không tồn tại." };
        }
        if (admin.isActive === ADMIN_ISACTIVE.BANNED) {
            return { error: "Tài khoản Admin đã bị khóa." };
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return { error: "Mật khẩu không chính xác." };
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        admin = admin.toObject();
        delete admin.password;

        return { admin, token };
    }
    catch (error) {
        console.error("Error during admin login:", error);
        return { error: "Lỗi hệ thống" };
    }
}

export const ownerLoginService = async (email, password) => {
    try {
        let owner = await Owner.findOne({ email });
        if (!owner) {
            return { error: "Tài khoản Chủ Trọ không tồn tại." };
        }

        const isPasswordValid = await bcrypt.compare(password, owner.password);
        if (!isPasswordValid) {
            return { error: "Mật khẩu không chính xác." };
        }

        const token = jwt.sign(
            { id: owner._id, email: owner.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        owner = owner.toObject();
        delete owner.password;

        return { owner, token };
    }
    catch (error) {
        console.error("Error during owner login:", error);
        return { error: "Lỗi hệ thống" };
    }
}