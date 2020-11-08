import express from "express";

import userRoutes from "./user";
import projectRoutes from "./project";
import accessRoutes from './access';

const router = express.Router();

router.use("/user", userRoutes);
router.use("/project", projectRoutes);
router.use("/access",accessRoutes);
export default router;
