import Admin from "../models/Admin.js";
import Owner from "../models/Owner.js";
import Customer from "../models/Customer.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { ADMIN_ISACTIVE } from "../constants/Admin.constant.js";
import { OWNER_ISACTIVE } from "../constants/Owner.constant.js";
import { CUSTOMER_ISACTIVE } from "../constants/Customer.constant.js";

export const adminLoginService = async (username, password) => {
    try {
        let admin = await Admin.findOne({ username });
        if (!admin) {
            return { error: "Tài khoản Admin không tồn tại." };
        }
        if (admin.is_active === ADMIN_ISACTIVE.BANNED) {
            return { error: "Tài khoản Admin đã bị khóa." };
        }
        const isPasswordValid = await bcrypt.compare(password, admin.password);
        if (!isPasswordValid) {
            return { error: "Mật khẩu không chính xác." };
        }

        const token = jwt.sign(
            { id: admin._id, username: admin.username, role: admin.role, actor: "admin" },
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
        if (owner.is_active === OWNER_ISACTIVE.BANNED) return { error: "Tài khoản Owner đã bị cấm.", status: 403 };
        if (owner.is_active === OWNER_ISACTIVE.INACTIVE) return { error: "Tài khoản Owner đang bị tạm khóa.", status: 403 };

        const token = jwt.sign(
            { id: owner._id, email: owner.email, actor: "owner" },
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

const toCustomerResponse = (customer) => {
    const safeCustomer = customer.toObject ? customer.toObject() : { ...customer };
    delete safeCustomer.password;
    return safeCustomer;
};

export const customerRegisterService = async ({ full_name, email, phone_number = "", password } = {}) => {
    try {
        const normalizedName = typeof full_name === "string" ? full_name.trim() : "";
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        const normalizedPhone = typeof phone_number === "string" ? phone_number.trim() : "";

        if (!normalizedName || !normalizedEmail || typeof password !== "string" || !password) {
            return { error: "Vui lòng nhập họ tên, email và mật khẩu.", status: 400 };
        }
        if (normalizedName.length < 2 || normalizedName.length > 100) {
            return { error: "Họ tên phải có từ 2 đến 100 ký tự.", status: 400 };
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            return { error: "Email không hợp lệ.", status: 400 };
        }
        if (password.length < 8) {
            return { error: "Mật khẩu phải có ít nhất 8 ký tự.", status: 400 };
        }

        const existingCustomer = await Customer.findOne({ email: normalizedEmail }).select("_id");
        if (existingCustomer) {
            return { error: "Email này đã được đăng ký.", status: 409 };
        }

        const customer = await Customer.create({
            full_name: normalizedName,
            email: normalizedEmail,
            phone_number: normalizedPhone,
            password,
        });
        const token = jwt.sign(
            { id: customer._id, email: customer.email, actor: "customer" },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        return { customer: toCustomerResponse(customer), token };
    } catch (error) {
        if (error.code === 11000) {
            return { error: "Email này đã được đăng ký.", status: 409 };
        }
        if (error.name === "ValidationError") {
            return { error: Object.values(error.errors).map((item) => item.message).join(" "), status: 400 };
        }
        console.error("Error during customer registration:", error);
        return { error: "Lỗi hệ thống khi đăng ký tài khoản.", status: 500 };
    }
};

export const customerLoginService = async (email, password) => {
    try {
        const normalizedEmail = typeof email === "string" ? email.trim().toLowerCase() : "";
        if (!normalizedEmail || typeof password !== "string" || !password) {
            return { error: "Vui lòng nhập email và mật khẩu.", status: 400 };
        }

        const customer = await Customer.findOne({ email: normalizedEmail }).select("+password");
        if (!customer || !(await customer.comparePassword(password))) {
            return { error: "Email hoặc mật khẩu không chính xác.", status: 401 };
        }
        if (customer.is_active === CUSTOMER_ISACTIVE.BANNED) return { error: "Tài khoản Customer đã bị cấm.", status: 403 };
        if (customer.is_active === CUSTOMER_ISACTIVE.INACTIVE) return { error: "Tài khoản Customer đang bị tạm khóa.", status: 403 };

        const token = jwt.sign(
            { id: customer._id, email: customer.email, actor: "customer" },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );
        return { customer: toCustomerResponse(customer), token };
    } catch (error) {
        console.error("Error during customer login:", error);
        return { error: "Lỗi hệ thống khi đăng nhập.", status: 500 };
    }
};

export const updateCustomerProfileService = async (customerId, data = {}) => {
    try {
        const customer = await Customer.findById(customerId).select("+password");
        if (!customer) return { error: "Tài khoản Customer không tồn tại.", status: 404 };
        for (const field of ["full_name", "email", "phone_number", "avatar"]) {
            if (typeof data[field] === "string") customer[field] = data[field].trim();
        }
        if (data.new_password) {
            if (!data.current_password || !(await customer.comparePassword(data.current_password))) return { error: "Mật khẩu hiện tại không chính xác.", status: 400 };
            if (data.new_password.length < 8) return { error: "Mật khẩu mới phải có ít nhất 8 ký tự.", status: 400 };
            customer.password = data.new_password;
        }
        await customer.save();
        return { customer: toCustomerResponse(customer) };
    } catch (error) {
        if (error.code === 11000) return { error: "Email đã được tài khoản khác sử dụng.", status: 409 };
        if (error.name === "ValidationError") return { error: error.message, status: 400 };
        console.error("Error updating customer profile:", error);
        return { error: "Không thể cập nhật hồ sơ Customer.", status: 500 };
    }
};
