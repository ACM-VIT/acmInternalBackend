import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import validator from "../../../helpers/validator";
import projectSchema from "./projectSchema";
import Project from "../../../database/model/Project";
import ProjectRepo from "../../../database/respository/ProjectRepo";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";

const router = express.Router();

router.post(
  "/",
  validator(projectSchema.new),
  asyncHandler(async (req, res) => {
    const newProject: Project = req.body;

    const exists = await ProjectRepo.findByName(newProject.name);
    if (exists)
      throw new BadRequestError(
        `Project ${newProject.name} already exists in db`
      );

    const createdProject = await ProjectRepo.create(newProject);
    if (!createdProject)
      throw new InternalError(
        "unable to create Project:db error newProject.ts"
      );

    new SuccessResponse(`Created Project with id ${createdProject.id}`, {
      id: createdProject.id,
      newProject,
    }).send(res);
  })
);

export default router;
