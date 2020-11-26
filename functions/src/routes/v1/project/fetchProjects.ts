import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import validator, { ValidationSource } from "../../../helpers/validator";
import projectSchema from "./projectSchema";
import ProjectRepo from "../../../database/respository/ProjectRepo";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import Logger from "../../../core/Logger";
import authentication from "../../../auth/authentication";

const router = express.Router();

router.get(
    "/all",
  authentication,
  asyncHandler(async (req,res)=>{
        const allProjects = await ProjectRepo.fetchAll();
        if(!allProjects) throw new InternalError(`No projects retrieved in db`);

        new SuccessResponse(`Projects:`,{
            allProjects
        }).send(res);
    })
)


router.get(
    "/byId/:id",
    authentication,
    validator(projectSchema.byId,ValidationSource.PARAM),
    asyncHandler(async (req,res)=>{
        const docId=req.params.id;

        const project = await ProjectRepo.findById(docId);
        if(!project) throw new BadRequestError(`No project with the id ${docId}`);

        new SuccessResponse(`Project with id ${docId}`,{
            project
        }).send(res);
    })
)

router.get(
    "/byName/:name",
    authentication,
    asyncHandler(async (req,res)=>{
        const projectName=req.params.name;
        Logger.info(projectName);
        const project = await ProjectRepo.findByName(projectName);
        if (!project)
          throw new BadRequestError(
            `Project ${projectName} does not exist in db`
          );
        
        new SuccessResponse(`Project with name: ${projectName}`,{
            project
        }).send(res);
    })
)

export default router;
