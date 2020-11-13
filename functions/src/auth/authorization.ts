import express from 'express';
import { ProtectedRequest } from '../types/app-request';
import { AuthFailureError } from '../core/ApiError';
import RoleRepo from '../database/respository/RoleRepo';
import asyncHandler from '../helpers/asyncHandler';

const router = express.Router();

export default router.use(
  asyncHandler(async (req: ProtectedRequest, res, next) => {
    if (!req.user || !req.user.roles || !req.currentRoleCode)
      throw new AuthFailureError('Permission denied: no user loged in or current roles not set');

    const role = await RoleRepo.findByCode(req.currentRoleCode);
    if (!role) throw new AuthFailureError('Permission denied: failed to get The current RoleCode of leggeed in user from db ');


    //checks all the valid roles in the db with all the roles assigned to the logged in user 
    const validRoles = req.user.roles.filter(
      (userRole) => role.find((roleCode)=>roleCode.code === userRole)
    );

    if (!validRoles || validRoles.length == 0) throw new AuthFailureError('Permission denied: user did not have the required role,or failed to fetch roles from db');

    return next();
  }),
);
