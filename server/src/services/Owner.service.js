import Owner from "../models/Owner.js";
import { OWNER_ISACTIVE } from "../constants/Owner.constant.js";

export const getProfile = async (ownerId) => {
    try {
        const owner = await Owner.findOne({ _id: ownerId }).select("-password");
        if (!owner) {
            return { error: "Tài khoản không tồn tại" };
        }
        if (owner.isActive == OWNER_ISACTIVE.BANNED) {
            return { error: "Tài khoản đã bị cấm vĩnh viễn." };
        }
        return { owner };
    }
    catch (error) {
        console.error("Error fetching owner profile:", error);
        return { error: "Internal server error" };
    }
}