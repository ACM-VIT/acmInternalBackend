import express from "express";
import { SuccessMsgResponse } from "../../core/ApiResponse";

import userRoutes from "./user";

const router = express.Router();

router.get("/", (req, res) => {
  new SuccessMsgResponse(
    "Welcome to the Acm Internal Ecosystem Backend v1.0"
  ).send(res);
});

router.use("/user", userRoutes);

export default router;
