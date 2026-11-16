import Admin from "../models/Admin.js";

export const getProfileService = async (adminId) => {
    try {
        const admin = await Admin.findById(adminId).select("-password");
        if (!admin) {
            return { error: "Tài khoản Admin không tồn tại." };
        }

        return { admin };
    }
    catch (error) {
        console.error("Error fetching admin profile:", error);
        return { error: "Lỗi hệ thống" };
    }
}

export const updateMyProfileService = async (adminId, data = {}) => {
    try {
        const admin = await Admin.findById(adminId);
        if (!admin) return { error: "Không tìm thấy tài khoản Admin.", status: 404 };
        for (const field of ["username", "email", "phone", "avatar_url"]) {
            if (typeof data[field] === "string") admin[field] = data[field].trim();
        }
        if (data.new_password) {
            if (!data.current_password || !(await admin.comparePassword(data.current_password))) return { error: "Mật khẩu hiện tại không chính xác.", status: 400 };
            if (data.new_password.length < 8) return { error: "Mật khẩu mới phải có ít nhất 8 ký tự.", status: 400 };
            admin.password = data.new_password;
        }
        await admin.save();
        const safeAdmin = admin.toObject();
        delete safeAdmin.password;
        return { admin: safeAdmin };
    } catch (error) {
        if (error.code === 11000) return { error: "Email hoặc tên đăng nhập đã được sử dụng.", status: 409 };
        console.error("Error updating admin profile:", error);
        return { error: "Không thể cập nhật hồ sơ Admin.", status: 500 };
    }
};
