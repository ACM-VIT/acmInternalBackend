import express from "express";
import { SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";
import validator from "../../../helpers/validator";
import userSchema from "./userSchema";
import UserRepo from "../../../database/respository/UserRepo";
import User from "../../../database/model/User";

const router = express.Router();

router.post(
  "/",
  validator(userSchema.new),
  asyncHandler(async (req, res) => {
    const newUser: User = req.body;

    const createdUser = await UserRepo.create(newUser);

    new SuccessResponse(`Created User with id ${createdUser.id}`, {
      newUser,
    }).send(res);
  })
);
export default router;
