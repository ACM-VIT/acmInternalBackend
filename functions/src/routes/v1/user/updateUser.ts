import bcrypt from 'bcryptjs';
import express from "express";
import authentication from "../../../auth/authentication";
import { BadRequestError, InternalError } from "../../../core/ApiError";
import { SuccessMsgResponse, SuccessResponse } from "../../../core/ApiResponse";
import Logger from "../../../core/Logger";
import ProjectRepo from '../../../database/respository/ProjectRepo';
import UserRepo from "../../../database/respository/UserRepo";
import asyncHandler from "../../../helpers/asyncHandler";
import validator from "../../../helpers/validator";
import { ProtectedRequest } from "../../../types/app-request";
import userSchema from "./userSchema";

const router = express.Router();

router.use("/", authentication);

/*
note

note author:Gokul J Kurup


The access token is used to populate req.user with user info 
check out the autheication middleware

always remember to add the protested req type in 

*/

router.put(
  "/",
  validator(userSchema.update),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const docId = req.user?.id;
    if (!docId) throw new BadRequestError("Middle ware failed to parse token and get user id");
    const user = await UserRepo.findById(docId);
    if (!user)
      throw new BadRequestError(`User with id ${docId} does not exist`);
    if (req.body.pwd) {
      const salt = await bcrypt.genSaltSync(10);
      const hashedPwd = await bcrypt.hashSync(req.body.pwd, salt);
      req.body.pwd = hashedPwd;
    }
    if (req.body.full_name) {
      try {
        await ProjectRepo.updateTeamMemberName(user, req.body.full_name);
      } catch (err) {
        throw new InternalError(`error: failed to update the project team members name: ${err}`)
      }
    }

    if (req.body.profilePic) {
      try {
        await ProjectRepo.updateTeamMemberProfilePic(user, req.body.profilePic);
      } catch (err) {
        throw new InternalError(`error: failed to update the project team members profilepic: ${err}`)
      }
    }

    try {
      await UserRepo.update(docId, req.body);
      const updatedUser = await UserRepo.findById(docId);
      new SuccessResponse(`Sucessfully updated user of id ${docId}`, {
        user: updatedUser,
      }).send(res);
    } catch (err) {
      throw new InternalError("Unable to update user");
    }
  })
);

router.put(
  "/personalProfileLinks",
  validator(userSchema.updatePersonalProfiles),
  asyncHandler(async (req: ProtectedRequest, res) => {
    const docId = req.user?.id;
    if (!docId) throw new BadRequestError("Middle ware failed to parse token and get user id");


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
