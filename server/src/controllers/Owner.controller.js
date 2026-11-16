import * as OwwnerService from '../services/Owner.service.js';

export const getProfile = async (req, res) => {
    try {
        const { ownerId } = req.params;
        if (String(req.owner?._id) !== String(ownerId)) {
            return res.status(403).json({ message: "Bạn chỉ có thể xem hồ sơ của chính mình." });
        }
        const result = await OwwnerService.getProfile(ownerId);
        if(result.error) {
            return res.status(404).json({ message: result.error });
        }
        res.status(200).json({ 
            message: "Lấy thông tin chủ trọ thành công",
            ...result
        });
    }
    catch (error) {
        console.error("Error fetching owner profile:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getMyProfile = (req, res) => res.status(200).json({ owner: req.owner });

export const updateMyProfile = async (req, res) => {
    const result = await OwwnerService.updateMyProfile(req.owner._id, req.body || {});
    if (result.error) return res.status(result.status || 400).json({ message: result.error });
    return res.status(200).json({ message: "Đã cập nhật hồ sơ Owner.", ...result });
};
