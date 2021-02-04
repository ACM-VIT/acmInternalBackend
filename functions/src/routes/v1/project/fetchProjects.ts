import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import validator, { ValidationSource } from "../../../helpers/validator";
import projectSchema from "./projectSchema";
import ProjectRepo from "../../../database/respository/ProjectRepo";
import { BadRequestError, NoDataError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import Logger from "../../../core/Logger";
import authentication from "../../../auth/authentication";
import UserRepo from "../../../database/respository/UserRepo";

const router = express.Router();

router.use("/",authentication);

router.get(
    "/all",
  asyncHandler(async (req,res)=>{
        const allProjects = await ProjectRepo.fetchAll();
        if(!allProjects) throw new BadRequestError(`No projects retrieved in db`);

        new SuccessResponse(`Projects:`,{
            allProjects
        }).send(res);
    })
)

router.get(
    "/all/:pageNum",
    validator(projectSchema.byPageNum,ValidationSource.PARAM),
    asyncHandler(async (req,res)=>{
        let pn :number = parseInt(req.params.pageNum)
        const allProjects = await ProjectRepo.fetchAllPaginate(pn);
        if(!allProjects) throw new BadRequestError(`No projects retrieved in db`);

        new SuccessResponse(`Projects:`,{
            allProjects
        }).send(res);
    })
)

router.get(
    "/byTag/:tag",
    validator(projectSchema.byTag,ValidationSource.PARAM),
  asyncHandler(async (req,res)=>{
        const allProjects = await ProjectRepo.findByTag(req.params.tag);
        if(!allProjects) throw new BadRequestError(`No projects retrieved in db with tag: ${req.params.tag}`);

        new SuccessResponse(`Projects with tag: ${req.params.tag}`,{
            allProjects
        }).send(res);
    })
)


router.get(
    "/byUser/:id",
    validator(projectSchema.byId,ValidationSource.PARAM),
    asyncHandler(async (req,res) =>{
        const user = await UserRepo.findById(req.params.id);
        if(!user) throw new BadRequestError(`No such user with id: ${req.params.id}`);
        const allProjects = await ProjectRepo.findByFounder(user.full_name);
        if(!allProjects) throw new NoDataError(`No projects by the user or user not part of any projects`);

        new SuccessResponse(`Projects of user id: ${req.params.id}`,{
            allProjects
        }).send(res);
    }),
)

router.get(
    "/byId/:id",
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
