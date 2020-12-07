import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import validator from "../../../helpers/validator";
import userSchema from "./userSchema";
import UserRepo from "../../../database/respository/UserRepo";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessMsgResponse, SuccessResponse } from "../../../core/ApiResponse";
import Logger from "../../../core/Logger";
import authentication from "../../../auth/authentication";
import { ProtectedRequest } from "../../../types/app-request";
import bcrypt from 'bcryptjs'

const router = express.Router();

router.use("/",authentication);

//the access token is used to populate req.user with id 

router.put(
  "/",
  validator(userSchema.update),
  asyncHandler(async (req:ProtectedRequest, res) => {
    const docId = req.user?.id; 
    if(!docId) throw new BadRequestError("Middle ware failed to parse token and get user id");
    const user = await UserRepo.findById(docId);
    if (!user)
      throw new BadRequestError(`User with id ${docId} does not exist`);
    if(req.body.pwd) {
      const salt = await bcrypt.genSaltSync(10);
      const hashedPwd = await bcrypt.hashSync(req.body.pwd,salt);
      req.body.pwd = hashedPwd;
    }

    try {
      await UserRepo.update(docId, req.body);
      const updatedUser = await UserRepo.findById(docId);
      new SuccessResponse(`Sucessfully updated user of id ${docId}`, {
        user:updatedUser,
      }).send(res);
    } catch (err) {
      throw new InternalError("Unable to update user");
    }
  })
);

router.put(
  "/personalProfileLinks",
  validator(userSchema.updatePersonalProfiles),
  asyncHandler(async (req:ProtectedRequest, res) => {
    const docId = req.user?.id;
    if(!docId) throw new BadRequestError("Middle ware failed to parse token and get user id");


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
