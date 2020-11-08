import express from "express";
import { SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";
import validator from "../../../helpers/validator";
import accessSchema from "./accessSchema";
import UserRepo from "../../../database/respository/UserRepo";
import User from "../../../database/model/User";
import {  InternalError } from "../../../core/ApiError";
import crypto from 'crypto'
import KeystoreRepo from "../../../database/respository/KeystoreRepo";
import { createTokens } from "../../../auth/authUtils";
import Logger from "../../../core/Logger";

const router = express.Router();

router.post(
  "/basic",
  validator(accessSchema.login),
  asyncHandler(async (req, res) => {
    const newUser: User = req.body;

    let user = await UserRepo.findByEmail(newUser.email);
  
    
    const accessTokenKey = await crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = await crypto.randomBytes(64).toString('hex');

    if (!user) {
      user = await UserRepo.create(newUser);
    } else {
      user = await UserRepo.findById(user.id);
    }

    if(!(user?.id)) throw new InternalError(`Invalid Id of document in login of user ${user} `)
    let tokens;
    try {
      await KeystoreRepo.create({
          client: user.id,
          primaryKey:accessTokenKey,
          secondaryKey:refreshTokenKey,
      })
       tokens = await createTokens(user.id, accessTokenKey, refreshTokenKey);
    }catch(err) {
      Logger.info(err);
      throw new InternalError("error in creating tokens. Please check if they keys folder has public.pem and private.pem security rsa keys");
    }

    new SuccessResponse(`Created User with id ${user.id}`, {
      id: user.id,
      user,
      tokens,
    }).send(res);
  })
);
export default router;
