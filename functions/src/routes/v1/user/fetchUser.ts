import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import { SuccessResponse } from "../../../core/ApiResponse";
import UserRepo from "../../../database/respository/UserRepo";
import { BadRequestError } from "../../../core/ApiError";
import validator, { ValidationSource } from "../../../helpers/validator";
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
  "/byEmail/:email",
  validator(userSchema.findByEmail, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const { email } = req.params;

    const user = await UserRepo.findByEmail(email);
    if (!user) throw new BadRequestError("No user exists with that email id");

    new SuccessResponse(`User with email: ${email}`, { user }).send(res);
  })
);

router.get(
  "/byId/:id",
  validator(userSchema.byId, ValidationSource.PARAM),
  asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await UserRepo.findById(id);
    if (!user)
      throw new BadRequestError("No user exists with that document id");

    new SuccessResponse(`User with id ${id}`, { user }).send(res);
  })
);

export default router;
