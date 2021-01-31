import express from "express";

import newProject from "./newProject";
import deleteProject from './delProject';
import fetchProjects from './fetchProjects'
import updateProjects from './updateProject'
import joinProject from './joinProject'


const router = express.Router();

router.use("/new", newProject);
router.use("/delete",deleteProject);
router.use("/fetch",fetchProjects);
router.use("/update",updateProjects);
router.use("/join",joinProject);

export default router;
