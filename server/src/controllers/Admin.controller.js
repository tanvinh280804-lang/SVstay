import * as AdminService from "../services/Admin.service.js";
import * as AdminUserService from "../services/AdminUser.service.js";

const sendUserResult = (res, result, successStatus = 200) => {
    if (result.error) return res.status(result.error === "Không tìm thấy người dùng." ? 404 : 400).json({ message: result.error });
    return res.status(successStatus).json(result);
};

export const listUsers = async (req, res) => {
    try { return sendUserResult(res, await AdminUserService.listUsers(req.params.type, req.query.search || "")); }
    catch (error) { console.error("Admin list users error:", error); return res.status(500).json({ message: "Không thể tải danh sách người dùng." }); }
};

export const setUserStatus = async (req, res) => {
    try { return sendUserResult(res, await AdminUserService.setUserStatus(req.params.type, req.params.userId, req.body?.is_active)); }
    catch (error) {
        if (error.name === "ValidationError") return res.status(400).json({ message: error.message });
        console.error("Admin update user status error:", error);
        return res.status(500).json({ message: "Không thể cập nhật trạng thái tài khoản." });
    }
};

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

export const getMyProfile = (req, res) => res.status(200).json({ admin: req.admin });

export const updateMyProfile = async (req, res) => {
    const result = await AdminService.updateMyProfileService(req.admin._id, req.body || {});
    if (result.error) return res.status(result.status || 400).json({ message: result.error });
    return res.status(200).json({ message: "Đã cập nhật hồ sơ Admin.", ...result });
};
