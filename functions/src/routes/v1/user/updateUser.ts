import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import validator, { ValidationSource } from "../../../helpers/validator";
import userSchema from "./userSchema";
import UserRepo from "../../../database/respository/UserRepo";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";

const router = express.Router();

router.put(
  "/:id",
  validator(userSchema.byId, ValidationSource.PARAM),
  validator(userSchema.update),
  asyncHandler(async (req, res) => {
    const docId = req.params.id;
    const user = await UserRepo.findById(docId);
    if (!user)
      throw new BadRequestError(`User with id ${docId} does not exist`);

    try {
      await UserRepo.update(docId, req.body);
      const updatedUser = await UserRepo.findById(docId);
      new SuccessResponse(`Sucessfully updated user of id ${docId}`, {
        updatedUser,
      }).send(res);
    } catch (err) {
      throw new InternalError("Unable to update user");
    }
  })
);

export default router;
