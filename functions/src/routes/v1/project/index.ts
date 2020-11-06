import express from "express";

import newProject from "./newProject";
import deleteProject from './delProject';
import fetchProjects from './fetchProjects'
const router = express.Router();

router.use("/new", newProject);
router.use("/delete",deleteProject);
router.use("/fetch",fetchProjects);

export default router;
