import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import authentication from "../../../auth/authentication";
import validator, { ValidationSource } from "../../../helpers/validator";
import schema from './projectSchema'
import ProjectRepo from "../../../database/respository/ProjectRepo";
import { AuthFailureError, BadRequestError, InternalError } from "../../../core/ApiError";
import { ProtectedRequest } from "../../../types/app-request";
import { SuccessResponse } from "../../../core/ApiResponse";
const router = express.Router();

router.use("/",authentication);

router.put(
    "/:id",
    validator(schema.byId,ValidationSource.PARAM),
    asyncHandler(async (req:ProtectedRequest,res)=>{
        if(!req.user)
            throw new AuthFailureError("req.user: Auth failed , internal error")
        const projectId = req.params.id;
        const project = await ProjectRepo.findById(projectId);
        if(!project) throw new BadRequestError(`Project does not exist with id: ${projectId}`);

        try {
            await ProjectRepo.joinProject(projectId,req.user);

            const newProject = await ProjectRepo.findById(projectId);
            if(!newProject) throw new BadRequestError(`Project not able to be updated with id: ${projectId}`);


            new SuccessResponse(`Succesfully Added Teammember: ${req.user.full_name} to ${newProject.name}`,{
                project:newProject,
            })
        }catch(err) {
            throw new InternalError("failed to update the projet with  new team memeber");
        }
    })
)

export default router;

