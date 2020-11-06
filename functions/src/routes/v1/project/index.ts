import express from "express";

import newProject from "./newProject";
import deleteProject from './delProject';
import fetchProjects from './fetchProjects'
import updateProjects from './updateProject'
const router = express.Router();

router.use("/new", newProject);
router.use("/delete",deleteProject);
router.use("/fetch",fetchProjects);
router.use("/update",updateProjects);

export default router;
