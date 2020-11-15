import asyncHandler from "../helpers/asyncHandler";
import validator, { ValidationSource } from "../helpers/validator";
import express from 'express'
import authSchema from "./authSchema";
import { DiscordRequest} from "../types/app-request";
import {  AuthFailureError, InternalError,  } from "../core/ApiError";
import { getAccessToken } from "./authUtils";
import Logger from "../core/Logger";
import fetch from 'node-fetch';

const router= express.Router();

export default router.use(
    validator(authSchema.discordAuth,ValidationSource.HEADER),
    asyncHandler(async (req:DiscordRequest,res,next)=>{
    try {
        if(!req.headers.discord_token) throw new AuthFailureError("No Discord Auth Token in Request Header");
        req.discordToken = getAccessToken(req.headers.discord_token as string);
        console.log("got discord id token ")
        let discordUrl="https://discordapp.com/api/v6/users/@me";
        const login = await fetch(discordUrl,{
            headers:{
                'authorization':`Bearer ${req.discordToken}`
            }
        })
        const userInfo = await login.json();
        if(!userInfo.username)
            throw new InternalError("discord token verification failed");
      req.discordUser = userInfo;
      console.log(JSON.stringify(userInfo));
      return next();
      }catch(err) {
          Logger.info(err);
          throw new InternalError("failed to fetch discord api and verify token");
      }
    })
);