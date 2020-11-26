import express from "express";
import { SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";
import validator from "../../../helpers/validator";
import accessSchema from "./accessSchema";
import UserRepo from "../../../database/respository/UserRepo";
import User from "../../../database/model/User";
import {  BadRequestError, InternalError } from "../../../core/ApiError";
import crypto from 'crypto'
import KeystoreRepo from "../../../database/respository/KeystoreRepo";
import { createTokens } from "../../../auth/authUtils";
import Logger from "../../../core/Logger";
import googleTokenVerify  from "../../../auth/googleAuthMiddlware";
import { DiscordRequest, GoogleRequest} from "../../../types/app-request";
import discordTokenVerify from '../../../auth/discordAuthMiddleware'
import authentication from '../../../auth/authentication'

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
    } else if(user.id){
      user = await UserRepo.findById(user.id);
    } else {
      throw new InternalError("Unable to find the user id: Internal Error login.ts ln 33")
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


router.post(
  "/google",
  googleTokenVerify,
  asyncHandler(async (req:GoogleRequest, res) => {
    console.log("test");
    if(!req.user) throw new BadRequestError("Invalid User/No User Please login via google first")

    /* Comment Author: Gokul J Kurup
    
    1)req.user will contain all the google accounts info and is populated by the middleware googleTokenVerify 
    2)now i know it says accessToken everywhere but remember in the google oauth flow its idToken which u need to use 
      NOT access_token. this is a pretty fatal mistake  
    3) the idea here is that u use the google signin to authenticate to your cutstom jwt [refer Keystore db]. 
      trust me handling a custom auth is way more fun than reading pages and pages of docs only to get stuck on a {error:invalid grant} :(
    */
    const  googleInfo = req.user;
    let user = await UserRepo.findByEmail(req.user.email);
    console.log(req.user);

    const accessTokenKey = await crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = await crypto.randomBytes(64).toString('hex');
    console.log("gen all tokens");

    if (!user) {
      user = await UserRepo.create({
        full_name: req.user.name as string,
        email:req.user.email as string,
        profilePic:googleInfo.pic,
      } as User);
      console.log("first time user intial creation");
    } else if(user.id){
      user = await UserRepo.findById(user.id);
      console.log("second time use intial creation");
    } else {
      throw new InternalError("Unable to find the user id: Internal Error login.ts ln 33")
    }
    if(!(user?.id)) throw new InternalError(`Invalid Id of document in login of user ${user} `)
    if(!(user.accounts_connected?.google)) {
        await UserRepo.updateConnectedAccounts(user.id,{google: googleInfo});
        console.log("sucessfull update of accoutnts");
    }
    user = await UserRepo.findById(user.id) ;
    if(!user)
      throw new InternalError("Failed to fetch user");
    let tokens;
    try {
      await KeystoreRepo.create({
          client: user.id as string,
          primaryKey:accessTokenKey,
          secondaryKey:refreshTokenKey,
      })
       tokens = await createTokens(user.id as string, accessTokenKey, refreshTokenKey);
       req.user = user;
       new SuccessResponse(`Created User with id ${user.id}`, {
        id: user.id,
        user,
        tokens,
      }).send(res);
    }catch(err) {
      Logger.info(err);
      throw new InternalError("error in creating tokens. Please check if they keys folder has public.pem and private.pem security rsa keys");
    }
  })
);


router.post(
  "/discord",
  authentication,
  discordTokenVerify,
  asyncHandler(async (req:DiscordRequest, res) => {
    console.log("test");
    if(!req.user) throw new BadRequestError("Invalid User/No User Please login via discord first")

    const discordInfo = req.discordUser;
    let user = await UserRepo.findByEmail(req.user.email);
    if(!user) throw new BadRequestError("No User registered with that email");

    if(!(user?.id)) throw new InternalError(`Invalid Id of document in login of user ${user} `)
    if(!(user.accounts_connected?.discord)) {
        await UserRepo.updateConnectedAccounts(user.id,{discord: discordInfo});
    }
    user = await UserRepo.findById(user.id) ;
    if(!user) throw new InternalError("Discord Auth failed")
    req.user = user;
    new SuccessResponse(`Created User with id ${user.id}`, {
        id: user.id,
        user,
     }).send(res);
  })
);




export default router;
