import { Router } from "express";
import * as AuthController from "../controllers/Auth.controller.js";
import * as AdminController from "../controllers/Admin.controller.js";
import * as RoomTypeController from "../controllers/RoomType.controller.js";

import * as AdminMiddleware from "../middlewares/Admin.middleware.js";

const adminRouter = Router();

// Admin Authentication routes
adminRouter.post("/login", AuthController.adminLogin);
// Add more admin routes here as needed
adminRouter.get("/profile/:adminId", AdminMiddleware.AdminAuthorize, AdminController.getProfile);

// RoomType Management routes
adminRouter.get("/room-types", AdminMiddleware.AdminAuthorize, RoomTypeController.getAllRoomTypes);
export default adminRouter;