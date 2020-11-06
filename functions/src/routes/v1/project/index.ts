import express from "express";

import newProject from "./newProject";

const router = express.Router();

router.post("/new", newProject);

export default router;
