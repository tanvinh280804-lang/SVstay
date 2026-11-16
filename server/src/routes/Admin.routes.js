import { Router } from "express";
import * as AuthController from "../controllers/Auth.controller.js";
import * as AdminController from "../controllers/Admin.controller.js";
import * as RoomTypeController from "../controllers/RoomType.controller.js";
import * as RoomController from "../controllers/Room.controller.js";

import * as AdminMiddleware from "../middlewares/Admin.middleware.js";

const adminRouter = Router();

// Admin Authentication routes
adminRouter.post("/login", AuthController.adminLogin);
// Add more admin routes here as needed
adminRouter.get("/profile/me", AdminMiddleware.AdminAuthorize, AdminController.getMyProfile);
adminRouter.patch("/profile/me", AdminMiddleware.AdminAuthorize, AdminController.updateMyProfile);
adminRouter.get("/profile/:adminId", AdminMiddleware.AdminAuthorize, AdminController.getProfile);
adminRouter.get("/users/:type", AdminMiddleware.AdminAuthorize, AdminController.listUsers);
adminRouter.patch("/users/:type/:userId/status", AdminMiddleware.AdminAuthorize, AdminController.setUserStatus);

// RoomType Management routes
adminRouter.get("/room-types", AdminMiddleware.AdminAuthorize, RoomTypeController.getAllRoomTypes);
adminRouter.post("/room-types", AdminMiddleware.AdminAuthorize, RoomTypeController.addNewRoomType);
adminRouter.delete("/room-types/:roomTypeId", AdminMiddleware.AdminAuthorize, RoomTypeController.removeRoomType);
adminRouter.patch("/room-types/:roomTypeId", AdminMiddleware.AdminAuthorize, RoomTypeController.updateRoomType);
adminRouter.get("/rooms", AdminMiddleware.AdminAuthorize, RoomController.getRoomsForAdmin);
adminRouter.patch("/rooms/:roomId/review", AdminMiddleware.AdminAuthorize, RoomController.reviewRoom);

export default adminRouter;
