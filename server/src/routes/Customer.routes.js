import { Router } from "express";
import * as RoomController from "../controllers/Room.controller.js";
import * as RoomTypeController from "../controllers/RoomType.controller.js";
import * as AuthController from "../controllers/Auth.controller.js";
import { customerAuthorize } from "../middlewares/Customer.middleware.js";

const customerRouter = Router();

customerRouter.post("/register", AuthController.customerRegister);
customerRouter.post("/login", AuthController.customerLogin);
customerRouter.get("/me", customerAuthorize, AuthController.getCustomerMe);
customerRouter.patch("/me", customerAuthorize, AuthController.updateCustomerMe);

// ==================== Customer Public Room routes ====================

// 1. Lấy danh sách các phòng đang hoạt động (hỗ trợ tìm kiếm, lọc theo giá, diện tích, loại phòng, tiện ích, phân trang)
customerRouter.get("/rooms", RoomController.getActiveRoomsForCustomer);

// 2. Lấy chi tiết một phòng đang hoạt động (hỗ trợ tra cứu theo cả _id hoặc room_slug, kèm phòng tương tự)
customerRouter.get("/rooms/:idOrSlug", RoomController.getRoomDetailForCustomer);

// 3. Lấy danh sách loại phòng cho bộ lọc
customerRouter.get("/room-types", RoomTypeController.getAllRoomTypes);

// ==================== Alias routes (dạng số ít /room) ====================
customerRouter.get("/room", RoomController.getActiveRoomsForCustomer);
customerRouter.get("/room/:idOrSlug", RoomController.getRoomDetailForCustomer);

export default customerRouter;
