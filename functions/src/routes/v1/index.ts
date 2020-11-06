import express from "express";

import userRoutes from "./user";
import projectRoutes from "./project";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/project", projectRoutes);

export default router;
