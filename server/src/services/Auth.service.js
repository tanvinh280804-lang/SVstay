import Admin from "../models/Admin.js";
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
        throw new Error("Lỗi hệ thống");
    }
}