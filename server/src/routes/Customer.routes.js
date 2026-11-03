import {Router} from "express";

const customerRouter = Router();

// Customer routes
customerRouter.get("/customer", (req, res) => {
  res.send("Customer route");
});

export default customerRouter;