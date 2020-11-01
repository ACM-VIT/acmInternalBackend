import express from "express";
import { SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";
import validator from "../../../helpers/validator";
import userSchema from "./userSchema";
import UserRepo from "../../../database/respository/UserRepo";
import User from "../../../database/model/User";
import { BadRequestError } from "../../../core/ApiError";

const router = express.Router();

router.post(
  "/",
  validator(userSchema.new),
  asyncHandler(async (req, res) => {
    const newUser: User = req.body;

    const exists = await UserRepo.findByEmail(newUser.email);
    if (exists)
      throw new BadRequestError(
        `User with email ${newUser.email} already exists`
      );

    const createdUser = await UserRepo.create(newUser);

    new SuccessResponse(`Created User with id ${createdUser.id}`, {
      id: createdUser.id,
      newUser,
    }).send(res);
  })
);
export default router;
