import { Router } from "express";

const ownerRouter = Router();

// Owner routes
ownerRouter.get("/owner", (req, res) => {
  res.send("Owner route");
});

export default ownerRouter;
