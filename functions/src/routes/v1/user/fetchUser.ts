import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import { SuccessResponse } from "../../../core/ApiResponse";
import UserRepo from "../../../database/respository/UserRepo";
import { BadRequestError } from "../../../core/ApiError";
import validator from "../../../helpers/validator";
import userSchema from "./userSchema";

const router = express.Router();

router.get(
  "/all",
  asyncHandler(async (req, res) => {
    const allUsers = await UserRepo.fetchAll();

    new SuccessResponse("All Users: ", {
      allUsers,
    }).send(res);
  })
);

router.get(
  "/byEmail",
  validator(userSchema.findByEmail),
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await UserRepo.findByEmail(email);
    if (!user) throw new BadRequestError("No user exists with that email id");

    new SuccessResponse(`User with email: ${email}`, { user }).send(res);
  })
);

export default router;
