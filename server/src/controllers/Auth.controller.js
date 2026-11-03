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