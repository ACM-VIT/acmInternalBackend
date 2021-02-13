import express from 'express';
import authentication from "../../../auth/authentication";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import ProjectRepo from "../../../database/respository/ProjectRepo";
import asyncHandler from "../../../helpers/asyncHandler";
import validator, { ValidationSource } from "../../../helpers/validator";
import projectSchema from "./projectSchema";


const router = express.Router();

router.use("/", authentication);

router.put(
  "/byId/:id",
  validator(projectSchema.byId, ValidationSource.PARAM),
  validator(projectSchema.update),
  asyncHandler(async (req, res) => {
    const docId = req.params.id;
    const user = await ProjectRepo.findById(docId);
    if (!user)
      throw new BadRequestError(`User with id ${docId} does not exist`);

    try {
      await ProjectRepo.update(docId, req.body);
      const updatedProject = await ProjectRepo.findById(docId);
      new SuccessResponse(`Sucessfully updated project of id ${docId}`, {
        updatedProject,
      }).send(res);
    } catch (err) {
      throw new InternalError("Required at lease one parameter to update. Please do not supply an empty req.body for update");
    }
  })
);
router.put(
  "/projectResourcesLinks/:id",
  validator(projectSchema.byId, ValidationSource.PARAM),
  validator(projectSchema.updateResource),
  asyncHandler(async (req, res) => {
    const docId = req.params.id;
    const user = await ProjectRepo.findById(docId);
    if (!user)
      throw new BadRequestError(`User with id ${docId} does not exist`);

    try {
      await ProjectRepo.updateResourcesLinks(docId, req.body);
      const updatedProject = await ProjectRepo.findById(docId);
      new SuccessResponse(`Sucessfully updated project of id ${docId}`, {
        updatedProject,
      }).send(res);
    } catch (err) {
      throw new InternalError("Required at lease one parameter to update. Please do not supply an empty req.body for update");
    }
  })
);

router.put(
  "/rolesWanted/:id",
  validator(projectSchema.byId, ValidationSource.PARAM),
  validator(projectSchema.updateWanted),
  asyncHandler(async (req, res) => {
    const docId = req.params.id;
    const user = await ProjectRepo.findById(docId);
    if (!user)
      throw new BadRequestError(`User with id ${docId} does not exist`);

    try {
      await ProjectRepo.updateWanted(docId, req.body);
      const updatedProject = await ProjectRepo.findById(docId);
      new SuccessResponse(`Sucessfully updated project of id ${docId}`, {
        updatedProject,
      }).send(res);
    } catch (err) {
      throw new InternalError("Required at lease one parameter to update. Please do not supply an empty req.body for update");
    }
  })
);

export default router;
