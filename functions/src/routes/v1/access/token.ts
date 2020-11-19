import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import { ProtectedRequest } from "../../../types/app-request";
import accessSchema from "./accessSchema";
import validator, { ValidationSource } from "../../../helpers/validator";
import UserRepo from "../../../database/respository/UserRepo";
import { createTokens, getAccessToken, validateTokenData } from "../../../auth/authUtils";
import JWT from "../../../core/JWT";
import { AuthFailureError, InternalError } from "../../../core/ApiError";
import KeystoreRepo from "../../../database/respository/KeystoreRepo";
import crypto from 'crypto'
import { TokenRefreshResponse } from "../../../core/ApiResponse";

const router = express.Router();

router.post(
  '/refresh',
  validator(accessSchema.auth, ValidationSource.HEADER),
  validator(accessSchema.refreshToken),
  asyncHandler(async (req: ProtectedRequest, res) => {
    req.accessToken = getAccessToken(req.headers.authorization as string); // Express headers are auto converted to lowercase

    const accessTokenPayload = await JWT.decode(req.accessToken);
    validateTokenData(accessTokenPayload);

    const user = await UserRepo.findById(accessTokenPayload.sub);
    if (!user) throw new AuthFailureError('User not registered');
    req.user = user;
    if(!req.user.id) throw new InternalError("No id in user obj in refresh token route");

    const refreshTokenPayload = await JWT.validate(req.body.refreshToken);
    validateTokenData(refreshTokenPayload);

    if (accessTokenPayload.sub !== refreshTokenPayload.sub)
      throw new AuthFailureError('Invalid access token');

    const keystore = await KeystoreRepo.find(
      req.user,
      accessTokenPayload.prm,
      refreshTokenPayload.prm,
    );

    if (!keystore) throw new AuthFailureError('Invalid access token');
    await KeystoreRepo.delete(keystore.id);

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');

    await KeystoreRepo.create({client: req.user.id ,primaryKey: accessTokenKey,secondaryKey: refreshTokenKey});
    const tokens = await createTokens(req.user.id , accessTokenKey, refreshTokenKey);

    new TokenRefreshResponse('Token Issued', tokens.accessToken, tokens.refreshToken).send(res);
  }),
);

export default router;
