import { Router } from "express";
import adminRouter from "./Admin.routes.js";
import customerRouter from "./Customer.routes.js";
import ownerRouter from "./Owner.routes.js";

const router = Router();

router.use('/admin', adminRouter);
router.use('/customer', customerRouter);
router.use('/owner', ownerRouter);

export default router;