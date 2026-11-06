import * as OwwnerService from '../services/Owner.service.js';

export const getProfile = async (req, res) => {
    try {
        const { ownerId } = req.params;
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
