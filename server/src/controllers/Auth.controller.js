import * as AuthService from "../services/Auth.service.js";

export const adminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await AuthService.adminLoginService(username, password);
        if (result.error) {
            return res.status(400).json({ message: result.error });
        }
        res.status(200).json({
            message: "Đăng nhập thành công",
            ...result,
        });
    }
    catch (error) {
        console.error("Error during admin login:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const ownerLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const result = await AuthService.ownerLoginService(email, password);
        if (result.error) {
            return res.status(result.status || 400).json({ message: result.error });
        }
        res.status(200).json({
            message: "Đăng nhập thành công",
            ...result,
        });
    }
    catch (error) {
        console.error("Error during owner login:", error);
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
}

export const customerRegister = async (req, res) => {
    const result = await AuthService.customerRegisterService(req.body || {});
    if (result.error) {
        return res.status(result.status || 400).json({ message: result.error });
    }
    return res.status(201).json({ message: "Đăng ký tài khoản thành công.", ...result });
};

export const customerLogin = async (req, res) => {
    const { email, password } = req.body || {};
    const result = await AuthService.customerLoginService(email, password);
    if (result.error) {
        return res.status(result.status || 400).json({ message: result.error });
    }
    return res.status(200).json({ message: "Đăng nhập thành công.", ...result });
};

export const getCustomerMe = (req, res) => {
    return res.status(200).json({ customer: req.customer });
};

export const updateCustomerMe = async (req, res) => {
    const result = await AuthService.updateCustomerProfileService(req.customer._id, req.body || {});
    if (result.error) return res.status(result.status || 400).json({ message: result.error });
    return res.status(200).json({ message: "Đã cập nhật hồ sơ Customer.", ...result });
};
