import { Router } from "express";
import * as AuthController from "../controllers/Auth.controller.js";
import * as OwnerController from "../controllers/Owner.controller.js";
import * as OwnerMiddleware from "../middlewares/Owner.middleware.js";

const ownerRouter = Router();

// Owner Authentication routes
ownerRouter.post("/login", AuthController.ownerLogin);
ownerRouter.get("/profile/:ownerId", OwnerMiddleware.ownerAuthorize, OwnerController.getProfile);

export default ownerRouter;
