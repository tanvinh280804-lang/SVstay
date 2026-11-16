import Owner from "../models/Owner.js";
import { OWNER_ISACTIVE } from "../constants/Owner.constant.js";

export const getProfile = async (ownerId) => {
    try {
        const owner = await Owner.findOne({ _id: ownerId }).select("-password");
        if (!owner) {
            return { error: "Tài khoản không tồn tại" };
        }
        if (owner.is_active == OWNER_ISACTIVE.BANNED) {
            return { error: "Tài khoản đã bị cấm vĩnh viễn." };
        }
        return { owner };
    }
    catch (error) {
        console.error("Error fetching owner profile:", error);
        return { error: "Internal server error" };
    }
}

export const updateMyProfile = async (ownerId, data = {}) => {
    try {
        const owner = await Owner.findById(ownerId);
        if (!owner) return { error: "Tài khoản Owner không tồn tại.", status: 404 };
        for (const field of ["full_name", "email", "phone_number", "identity_card", "address", "avatar"]) {
            if (typeof data[field] === "string") owner[field] = data[field].trim();
        }
        if (data.new_password) {
            if (!data.current_password || !(await owner.comparePassword(data.current_password))) return { error: "Mật khẩu hiện tại không chính xác.", status: 400 };
            if (data.new_password.length < 8) return { error: "Mật khẩu mới phải có ít nhất 8 ký tự.", status: 400 };
            owner.password = data.new_password;
        }
        await owner.save();
        const safeOwner = owner.toObject();
        delete safeOwner.password;
        return { owner: safeOwner };
    } catch (error) {
        if (error.code === 11000) return { error: "Email đã được tài khoản khác sử dụng.", status: 409 };
        if (error.name === "ValidationError") return { error: error.message, status: 400 };
        console.error("Error updating owner profile:", error);
        return { error: "Không thể cập nhật hồ sơ Owner.", status: 500 };
    }
};
