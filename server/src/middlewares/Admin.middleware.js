import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { ADMIN_ROLE, ADMIN_ISACTIVE } from "../constants/Admin.constant.js";

export const AdminAuthorize = async (req, res, next) => {
    try {
        let token = null;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.split(" ")[1];
        } else if (req.cookies && req.cookies.token) {
            token = req.cookies.token;
        }

        if (!token) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập hoặc không tìm thấy token xác thực."
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (
            decoded.role != ADMIN_ROLE.ADMIN &&
            decoded.role != ADMIN_ROLE.SUPERADMIN
        ) {
            return res.status(403).json({
                message: "Bạn không có quyền truy cập tài nguyên này."
            });
        }

        const admin = await Admin.findById(decoded.id).select("-password");
        if (!admin) {
            return res.status(401).json({
                message: "Tài khoản Admin không tồn tại."
            });
        }

        req.admin = admin;
        req.user = decoded;

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Token xác thực không hợp lệ."
            });
        }

        console.error("Error in AdminAuthorize middleware:", error);
        return res.status(500).json({
            message: "Lỗi hệ thống khi xác thực quyền Admin."
        });
    }
};

export const isAdminActive = async (req, res, next) => {
    try {
        let admin = req.admin;

        // Nếu chưa có req.admin (gọi độc lập), tự động xác thực qua token hoặc tra cứu qua adminId
        if (!admin) {
            let token = null;
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else if (req.cookies && req.cookies.token) {
                token = req.cookies.token;
            }

            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                admin = await Admin.findById(decoded.id).select("-password");
                if (admin) {
                    req.admin = admin;
                    req.user = decoded;
                }
            } else {
                const adminId = req.params.adminId || req.params.id || req.body.adminId;
                if (adminId) {
                    admin = await Admin.findById(adminId).select("-password");
                    if (admin) {
                        req.admin = admin;
                    }
                }
            }
        }

        if (!admin) {
            return res.status(401).json({
                message: "Không tìm thấy thông tin tài khoản Admin để kiểm tra trạng thái."
            });
        }

        if (admin.isActive === ADMIN_ISACTIVE.BANNED) {
            return res.status(403).json({
                message: "Tài khoản Admin đã bị khóa vĩnh viễn (Banned)."
            });
        }

        if (admin.isActive === ADMIN_ISACTIVE.INACTIVE) {
            return res.status(403).json({
                message: "Tài khoản Admin đang tạm thời bị khóa hoặc chưa kích hoạt."
            });
        }

        if (admin.isActive !== ADMIN_ISACTIVE.ACTIVE) {
            return res.status(403).json({
                message: "Tài khoản Admin đã bị khóa hoặc không hoạt động."
            });
        }

        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại."
            });
        }
        if (error.name === "JsonWebTokenError") {
            return res.status(401).json({
                message: "Token xác thực không hợp lệ."
            });
        }

        console.error("Error in isAdminActive middleware:", error);
        return res.status(500).json({
            message: "Lỗi hệ thống khi kiểm tra trạng thái tài khoản Admin."
        });
    }
};

export const isSuperAdmin = (req, res, next) => {
    try {
        if (!req.admin) {
            return res.status(401).json({
                message: "Vui lòng xác thực tài khoản Admin trước khi kiểm tra quyền Super Admin."
            });
        }

        const isSuper =
            req.admin.role == ADMIN_ROLE.SUPERADMIN ||
            req.admin.role === "superadmin";

        if (!isSuper) {
            return res.status(403).json({
                message: "Bạn không có quyền thực hiện hành động này. Yêu cầu quyền Super Admin."
            });
        }

        next();
    } catch (error) {
        console.error("Error in isSuperAdmin middleware:", error);
        return res.status(500).json({
            message: "Lỗi hệ thống khi kiểm tra quyền Super Admin."
        });
    }
};

