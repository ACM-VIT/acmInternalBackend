import express from "express";
import accessRoutes from './access';
import meetingRoutes from './meeting';
import projectRoutes from "./project";
import userRoutes from "./user";


const router = express.Router();

router.use("/user", userRoutes);
router.use("/project", projectRoutes);
router.use("/access", accessRoutes);
router.use("/meeting", meetingRoutes)
export default router;
