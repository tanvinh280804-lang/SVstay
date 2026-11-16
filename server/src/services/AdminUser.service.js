import Customer from "../models/Customer.js";
import Owner from "../models/Owner.js";

const getModel = (type) => {
    if (type === "customers") return Customer;
    if (type === "owners") return Owner;
    return null;
};

export const listUsers = async (type, search = "") => {
    const Model = getModel(type);
    if (!Model) return { error: "Loại người dùng không hợp lệ." };
    const escapedSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = escapedSearch ? { $or: [
        { full_name: new RegExp(escapedSearch, "i") },
        { email: new RegExp(escapedSearch, "i") },
        { phone_number: new RegExp(escapedSearch, "i") },
    ] } : {};
    const users = await Model.find(filter).select("-password").sort({ createdAt: -1 }).limit(500).lean();
    return { users, total: users.length };
};

export const setUserStatus = async (type, userId, status) => {
    const Model = getModel(type);
    if (!Model) return { error: "Loại người dùng không hợp lệ." };
    const nextStatus = Number(status);
    if (![0, 1, 2].includes(nextStatus)) return { error: "Trạng thái tài khoản không hợp lệ." };
    const user = await Model.findById(userId);
    if (!user) return { error: "Không tìm thấy người dùng." };
    user.is_active = nextStatus;
    await user.save();
    const result = user.toObject();
    delete result.password;
    return { message: "Đã cập nhật trạng thái tài khoản.", user: result };
};
