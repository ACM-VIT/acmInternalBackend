import express from 'express';
import { ProtectedRequest } from '../types/app-request';
import UserRepo from '../database/respository/UserRepo';
import { AuthFailureError, AccessTokenError, TokenExpiredError } from '../core/ApiError';
import JWT from '../core/JWT';
import KeystoreRepo from '../database/respository/KeystoreRepo';
import { getAccessToken, validateTokenData } from './authUtils';
import validator, { ValidationSource } from '../helpers/validator';
import asyncHandler from '../helpers/asyncHandler';
import authSchema from './authSchema';

const router = express.Router();

export default router.use(
  validator(authSchema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    if(!req.headers.authorization) throw new AuthFailureError("No Auth Token in Request Header");
    req.accessToken = getAccessToken(req.headers.authorization); // Express headers are auto converted to lowercase

    try {
      const payload = await JWT.validate(req.accessToken);
      validateTokenData(payload);

      const user = await UserRepo.findById(payload.sub);
      if (!user) throw new AuthFailureError('User not registered');
      req.user = user ;

      const keystore = await KeystoreRepo.findById(payload.sub);
      if (!keystore) throw new AuthFailureError('No such User Logged in/ Credentials have expired. Please Login again .');
      req.keystore = keystore;

      return next();
    } catch (e) {
      if (e instanceof TokenExpiredError) throw new AccessTokenError(e.message);
      throw e;
    }
  }),
);