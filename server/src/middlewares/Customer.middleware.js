import jwt from "jsonwebtoken";
import Customer from "../models/Customer.js";
import { CUSTOMER_ISACTIVE } from "../constants/Customer.constant.js";

export const customerAuthorize = async (req, res, next) => {
    try {
        const authorization = req.headers.authorization || "";
        const token = authorization.startsWith("Bearer ") ? authorization.slice(7) : null;
        if (!token) {
            return res.status(401).json({ message: "Bạn cần đăng nhập bằng tài khoản khách hàng." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.id || decoded.actor !== "customer") {
            return res.status(401).json({ message: "Token không thuộc tài khoản khách hàng." });
        }

        const customer = await Customer.findById(decoded.id).select("-password");
        if (!customer) {
            return res.status(401).json({ message: "Tài khoản khách hàng không còn tồn tại." });
        }
        if (customer.is_active === CUSTOMER_ISACTIVE.BANNED) {
            return res.status(403).json({ message: "Tài khoản Customer đã bị cấm." });
        }
        if (customer.is_active === CUSTOMER_ISACTIVE.INACTIVE) {
            return res.status(403).json({ message: "Tài khoản Customer đang bị tạm khóa." });
        }

        req.customer = customer;
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError" || error.name === "JsonWebTokenError") {
            return res.status(401).json({ message: "Phiên đăng nhập không hợp lệ hoặc đã hết hạn." });
        }
        console.error("Error authorizing customer:", error);
        return res.status(500).json({ message: "Lỗi hệ thống khi xác thực khách hàng." });
    }
};

export default { customerAuthorize };
