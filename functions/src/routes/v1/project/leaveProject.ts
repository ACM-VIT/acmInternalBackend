import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import authentication from "../../../auth/authentication";
import validator, { ValidationSource } from "../../../helpers/validator";
import schema from './projectSchema'
import ProjectRepo from "../../../database/respository/ProjectRepo";
import { AuthFailureError, BadRequestError, InternalError } from "../../../core/ApiError";
import { ProtectedRequest } from "../../../types/app-request";
import { SuccessResponse } from "../../../core/ApiResponse";
import UserRepo from "../../../database/respository/UserRepo";
const router = express.Router();

router.use("/",authentication);

router.put(
    "/:id",
    validator(schema.byId,ValidationSource.PARAM),
    asyncHandler(async (req:ProtectedRequest,res)=>{
        if(!req.user || !req.user.id)
            throw new AuthFailureError("req.user: Auth failed , internal error")
        const projectId = req.params.id;
        const project = await ProjectRepo.findById(projectId);
        if(!project) throw new BadRequestError(`Project does not exist with id: ${projectId}`);

        try {
            const user = req.user;
            await ProjectRepo.leaveProject(projectId,user.full_name);
        }catch(err) {
            throw new InternalError(`failed to remove team member from projetct collection  ${err}`);
        }
           
        const newProject = await ProjectRepo.findById(projectId);
        if(!newProject) throw new BadRequestError(`Project not able to be updated with id: ${projectId}`);

        
        try {
            await UserRepo.leaveProject(req.user.id,newProject.name);
        }catch(err) {
            throw new InternalError(`failed to remove user with new project brief: ${err}`)
        }

        new SuccessResponse(`Succesfully Added Team member: ${req.user.full_name} to ${newProject.name}`,{
            project:newProject,
        }).send(res);
    
    })
)

export default router;
