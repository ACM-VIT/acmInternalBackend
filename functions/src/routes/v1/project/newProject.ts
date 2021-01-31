import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import validator from "../../../helpers/validator";
import projectSchema from "./projectSchema";
import Project, { ProjectStatus } from "../../../database/model/Project";
import ProjectRepo from "../../../database/respository/ProjectRepo";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import authentication from "../../../auth/authentication";
import { ProtectedRequest } from "../../../types/app-request";

const router = express.Router();

router.post(
  "/",
  authentication,
  validator(projectSchema.new),
  asyncHandler(async (req:ProtectedRequest, res) => {
    const newProject: Project = req.body;
    const docId = req.user?.id;
    if(!docId || !req.user) throw new BadRequestError("Middle ware failed to parse token and get user id in new project route  ");
    newProject.founder = req.user;
    delete newProject.founder["accounts_connected"];
    delete newProject.founder["projects"];
    newProject.status = ProjectStatus.IDEATION;
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


    try {
      await ProjectRepo.joinProject(createdProject.id,req.user);
    }catch(err) {
      throw new InternalError("failed to join project in new project route");
    }

    new SuccessResponse(`Created Project with id ${createdProject.id}`, {
      id: createdProject.id,
      newProject,
    }).send(res);
  })
);

export default router;
