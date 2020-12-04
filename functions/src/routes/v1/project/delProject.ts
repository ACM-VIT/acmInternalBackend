import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import ProjectRepo from "../../../database/respository/ProjectRepo";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import validator, { ValidationSource } from "../../../helpers/validator";
import projectSchema from "./projectSchema";
import { SuccessMsgResponse } from "../../../core/ApiResponse";
import authentication from "../../../auth/authentication";

const router = express.Router();

router.use("/",authentication);

router.delete(
    "/:id",
    validator(projectSchema.byId,ValidationSource.PARAM),
    asyncHandler(async (req,res)=>{
        const docId = req.params.id;
        const project = await ProjectRepo.findById(docId);
        if(!project) throw new BadRequestError(`No project exists in db with id: ${docId}`);

        try {
            await ProjectRepo.delete(docId);
            new SuccessMsgResponse(
              `User sucesssfully deleted of email: ${project.name}`
            ).send(res);
          } catch (err) {
            throw new InternalError("Unable to delete user");
          }
    })
)

export default router;
