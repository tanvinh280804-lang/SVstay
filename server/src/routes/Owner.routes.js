import { Router } from "express";
import * as AuthController from "../controllers/Auth.controller.js";
import * as OwnerController from "../controllers/Owner.controller.js";
import * as RoomController from "../controllers/Room.controller.js";
import * as RoomTypeController from "../controllers/RoomType.controller.js";
import * as OwnerMiddleware from "../middlewares/Owner.middleware.js";
import upload from "../config/cloudinary.config.js";

const ownerRouter = Router();

// ==================== Owner Authentication routes ====================
ownerRouter.post("/login", AuthController.ownerLogin);
ownerRouter.get("/profile/me", OwnerMiddleware.ownerAuthorize, OwnerMiddleware.isOwnerActive, OwnerController.getMyProfile);
ownerRouter.patch("/profile/me", OwnerMiddleware.ownerAuthorize, OwnerMiddleware.isOwnerActive, OwnerController.updateMyProfile);
ownerRouter.get("/profile/:ownerId", OwnerMiddleware.ownerAuthorize, OwnerController.getProfile);
ownerRouter.get("/room-types", RoomTypeController.getAllRoomTypes);

// ==================== Owner CRUD Room routes ====================
// 1. Lấy danh sách phòng của Chủ trọ (hỗ trợ phân trang, tìm kiếm, lọc)
ownerRouter.get(
    "/rooms",
    OwnerMiddleware.ownerAuthorize,
    OwnerMiddleware.isOwnerActive,
    RoomController.getOwnerRooms
);

// 2. Lấy thông tin chi tiết một phòng của Chủ trọ
ownerRouter.get(
    "/rooms/:roomId",
    OwnerMiddleware.ownerAuthorize,
    OwnerMiddleware.isOwnerActive,
    RoomController.getOwnerRoomById
);

// 3. Thêm mới phòng (hỗ trợ upload tối đa 10 ảnh)
ownerRouter.post(
    "/rooms",
    OwnerMiddleware.ownerAuthorize,
    OwnerMiddleware.isOwnerActive,
    upload.array("images", 10),
    RoomController.createNewRoom
);

// 4. Cập nhật thông tin phòng (hỗ trợ PUT và PATCH, thêm ảnh mới nếu có)
ownerRouter.put(
    "/rooms/:roomId",
    OwnerMiddleware.ownerAuthorize,
    OwnerMiddleware.isOwnerActive,
    upload.array("images", 10),
    RoomController.updateRoom
);

ownerRouter.patch(
    "/rooms/:roomId",
    OwnerMiddleware.ownerAuthorize,
    OwnerMiddleware.isOwnerActive,
    upload.array("images", 10),
    RoomController.updateRoom
);

// 5. Thay đổi nhanh trạng thái phòng (status hoặc is_active)
ownerRouter.patch(
    "/rooms/:roomId/status",
    OwnerMiddleware.ownerAuthorize,
    OwnerMiddleware.isOwnerActive,
    RoomController.toggleRoomStatus
);

// 6. Xóa phòng của Chủ trọ
ownerRouter.delete(
    "/rooms/:roomId",
    OwnerMiddleware.ownerAuthorize,
    OwnerMiddleware.isOwnerActive,
    RoomController.deleteRoom
);

// ==================== Alias routes (số ít /room) ====================
ownerRouter.get("/room", OwnerMiddleware.ownerAuthorize, OwnerMiddleware.isOwnerActive, RoomController.getOwnerRooms);
ownerRouter.get("/room/:roomId", OwnerMiddleware.ownerAuthorize, OwnerMiddleware.isOwnerActive, RoomController.getOwnerRoomById);
ownerRouter.post("/room", OwnerMiddleware.ownerAuthorize, OwnerMiddleware.isOwnerActive, upload.array("images", 10), RoomController.createNewRoom);
ownerRouter.put("/room/:roomId", OwnerMiddleware.ownerAuthorize, OwnerMiddleware.isOwnerActive, upload.array("images", 10), RoomController.updateRoom);
ownerRouter.delete("/room/:roomId", OwnerMiddleware.ownerAuthorize, OwnerMiddleware.isOwnerActive, RoomController.deleteRoom);

export default ownerRouter;
