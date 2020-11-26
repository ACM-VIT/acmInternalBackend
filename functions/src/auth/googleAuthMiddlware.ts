import asyncHandler from "../helpers/asyncHandler";
import validator, { ValidationSource } from "../helpers/validator";
import express from 'express'
import authSchema from "./authSchema";
import { GoogleRequest } from "../types/app-request";
import {  AuthFailureError, InternalError,  } from "../core/ApiError";
import { getAccessToken } from "./authUtils";
import Logger from "../core/Logger";
import { googleClientId_reactnative_dev,googleClientId_android, googleClientId_reactnative_prod } from "../config";
import { OAuth2Client } from 'google-auth-library';
const client = new OAuth2Client( googleClientId_reactnative_dev, '', '' );

const router= express.Router();

export default router.use(
    validator(authSchema.auth,ValidationSource.HEADER),
    asyncHandler(async (req:GoogleRequest,res,next)=>{
    try {
        if(!req.headers.authorization) throw new AuthFailureError("No Auth Token in Request Header");
        req.accessToken = getAccessToken(req.headers.authorization as string);
        console.log("got id token ")
        const login = await client.verifyIdToken( { idToken: req.accessToken as string, audience: [googleClientId_android,googleClientId_reactnative_dev,googleClientId_reactnative_prod] } )
        console.log("token verified");
        var payload = login.getPayload();
        console.log("payload done");
        if(!payload)
            throw new InternalError("unable to parse the payload of google token response");
        var userid = payload['sub'];
        console.log("audience start")
        var audience = payload.aud;
        if (audience !== googleClientId_reactnative_dev && audience !== googleClientId_reactnative_prod && audience !== googleClientId_android) {
            throw new InternalError( `error while authenticating google user: audience mismatch: wanted [${googleClientId_reactnative_dev}/${googleClientId_android}/${googleClientId_reactnative_prod}] but was ${audience} instead`);
        }
        const userInfo = {
                name: payload['name'], //profile name
                pic: payload['picture'], //profile pic
                id: payload['sub'], //google id
                email_verified: payload['email_verified'], 
                email: payload['email'],
                userid
        }
      req.user = userInfo;
      console.log(userInfo);
      return next();
      }catch(err) {
          Logger.info(err);
          throw new InternalError("failed to fetch google api and verify token");
      }
    })
);