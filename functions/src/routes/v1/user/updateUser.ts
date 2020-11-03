import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import validator, { ValidationSource } from "../../../helpers/validator";
import userSchema from "./userSchema";
import UserRepo from "../../../database/respository/UserRepo";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessMsgResponse, SuccessResponse } from "../../../core/ApiResponse";
import Logger from "../../../core/Logger";

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

router.put(
  "/personalProfileLinks/:id",
  validator(userSchema.updatePersonalProfiles),
  asyncHandler(async (req, res) => {
    const docId = req.params.id;

    const user = await UserRepo.findById(docId);
    if (!user)
      throw new BadRequestError(`No such user exists with id: ${docId}`);
    if (!user.email)
      throw new InternalError(
        `No email assigned to user with id ${docId}.This is a serious error and please contact the creators/maintainers`
      );

    try {
      await UserRepo.updatePersonalLinks(docId, req.body);
      new SuccessMsgResponse(
        `Successfully Updated user of email ${user.email}`
      ).send(res);
    } catch (err) {
      Logger.info(err);
      throw new InternalError("unable to update document");
    }
  })
);

export default router;
