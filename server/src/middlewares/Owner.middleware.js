import jwt from "jsonwebtoken";
import Owner from "../models/Owner.js";
import { OWNER_ISACTIVE } from "../constants/Owner.constant.js";

export const OwnerAuthorize = async (req, res, next) => {
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

        if (!decoded || !decoded.id) {
            return res.status(401).json({
                message: "Token xác thực không hợp lệ."
            });
        }

        const owner = await Owner.findById(decoded.id).select("-password");
        if (!owner) {
            return res.status(401).json({
                message: "Tài khoản Chủ Trọ không tồn tại."
            });
        }

        req.owner = owner;
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

        console.error("Error in OwnerAuthorize middleware:", error);
        return res.status(500).json({
            message: "Lỗi hệ thống khi xác thực quyền Chủ Trọ."
        });
    }
};

export const isOwnerActive = async (req, res, next) => {
    try {
        let owner = req.owner;

        // Nếu chưa có req.owner (gọi độc lập), tự động xác thực qua token hoặc tra cứu qua ownerId
        if (!owner) {
            let token = null;
            if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
                token = req.headers.authorization.split(" ")[1];
            } else if (req.cookies && req.cookies.token) {
                token = req.cookies.token;
            }

            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                owner = await Owner.findById(decoded.id).select("-password");
                if (owner) {
                    req.owner = owner;
                    req.user = decoded;
                }
            } else {
                const ownerId = req.params.ownerId || req.params.id || req.body.ownerId;
                if (ownerId) {
                    owner = await Owner.findById(ownerId).select("-password");
                    if (owner) {
                        req.owner = owner;
                    }
                }
            }
        }

        if (!owner) {
            return res.status(401).json({
                message: "Không tìm thấy thông tin tài khoản Chủ Trọ để kiểm tra trạng thái."
            });
        }

        if (owner.isActive === OWNER_ISACTIVE.BANNED) {
            return res.status(403).json({
                message: "Tài khoản Chủ Trọ đã bị khóa vĩnh viễn (Banned)."
            });
        }

        if (owner.isActive === OWNER_ISACTIVE.INACTIVE) {
            return res.status(403).json({
                message: "Tài khoản Chủ Trọ đang tạm thời bị khóa hoặc chưa kích hoạt."
            });
        }

        if (owner.isActive !== OWNER_ISACTIVE.ACTIVE) {
            return res.status(403).json({
                message: "Tài khoản Chủ Trọ đã bị khóa hoặc không hoạt động."
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

        console.error("Error in isOwnerActive middleware:", error);
        return res.status(500).json({
            message: "Lỗi hệ thống khi kiểm tra trạng thái tài khoản Chủ Trọ."
        });
    }
};

export const ownerAuthorize = OwnerAuthorize;

