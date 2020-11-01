import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import validator from "../../../helpers/validator";
import userSchema from "./userSchema";
import UserRepo from "../../../database/respository/UserRepo";
import { SuccessMsgResponse } from "../../../core/ApiResponse";
import { BadRequestError, InternalError } from "../../../core/ApiError";

const router = express.Router();

router.delete(
  "/",
  validator(userSchema.findByEmail),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await UserRepo.findByEmail(email);
    if (!user) throw new BadRequestError("No user user exists");

    try {
      await UserRepo.deleteByEmail(email);
      new SuccessMsgResponse(
        `User sucesssfully deleted of email: ${email}`
      ).send(res);
    } catch (err) {
      throw new InternalError("Unable to delete user");
    }
  })
);

export default router;
