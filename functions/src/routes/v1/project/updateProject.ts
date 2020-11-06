import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import validator, { ValidationSource } from "../../../helpers/validator";
import projectSchema from "./projectSchema";
import ProjectRepo from "../../../database/respository/ProjectRepo";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";

const router = express.Router();

router.put(
    "/:id",
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
        throw new InternalError("Unable to update project");
      }
    })
  );

export default router;
