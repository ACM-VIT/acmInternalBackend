import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import validator, { ValidationSource } from "../../../helpers/validator";
import userSchema from "./userSchema";
import UserRepo from "../../../database/respository/UserRepo";
import { SuccessMsgResponse } from "../../../core/ApiResponse";
import { BadRequestError, InternalError } from "../../../core/ApiError";

const router = express.Router();

router.delete(
  "/:id",
  validator(userSchema.byId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await UserRepo.findById(id);
    if (!user)
      throw new BadRequestError("No such user with that document id exists");

    try {
      await UserRepo.delete(id);
      new SuccessMsgResponse(
        `User sucesssfully deleted of email: ${user.email}`
      ).send(res);
    } catch (err) {
      throw new InternalError("Unable to delete user");
    }
  })
);

export default router;
