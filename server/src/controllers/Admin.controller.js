import * as AdminService from "../services/Admin.service.js";

export const getProfile = async (req, res) => {
    try {
        const { adminId } = req.params;
        const  result = await AdminService.getProfileService(adminId);
        if (result.error) {
            return res.status(404).json({ message: result.error });
        }

        res.status(200).json({
            message: "Thông tin Admin được lấy thành công",
            ...result,
        })
    }
    catch (error) {
        console.error("Error fetching admin profile:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}