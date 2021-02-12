import express from 'express';
import authentication from "../../../auth/authentication";
import { AuthFailureError, BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import ProjectRepo from "../../../database/respository/ProjectRepo";
import UserRepo from "../../../database/respository/UserRepo";
import asyncHandler from "../../../helpers/asyncHandler";
import validator, { ValidationSource } from "../../../helpers/validator";
import { ProtectedRequest } from "../../../types/app-request";
import schema from './projectSchema';
const router = express.Router();

router.use("/", authentication);

router.put(
    "/:id",
    validator(schema.byId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        if (!req.user || !req.user.id)
            throw new AuthFailureError("req.user: Auth failed , internal error")
        const projectId = req.params.id;
        const project = await ProjectRepo.findById(projectId);
        if (!project) throw new BadRequestError(`Project does not exist with id: ${projectId}`);

        try {
            const user = req.user;
            await ProjectRepo.joinProject(projectId, user);
        } catch (err) {
            throw new InternalError(`failed to update the projet with  new team memeber: ${err}`);
        }

        const newProject = await ProjectRepo.findById(projectId);
        if (!newProject) throw new BadRequestError(`Project not able to be updated with id: ${projectId}`);


        try {
            await UserRepo.joinProjects(req.user.id, newProject.name);
        } catch (err) {
            throw new InternalError(`failed to update user obj with new project brief: ${err}`)
        }

        new SuccessResponse(`Succesfully Added Team member: ${req.user.full_name} to ${newProject.name}`, {
            project: newProject,
        }).send(res);

    })
)

export default router;

