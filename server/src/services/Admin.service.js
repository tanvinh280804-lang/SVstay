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
        throw new Error("Lỗi hệ thống");
    }
}