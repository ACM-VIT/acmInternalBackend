import asyncHandler from "../../../helpers/asyncHandler";
import express from 'express';
import authentication from "../../../auth/authentication";
import { SuccessMsgResponse } from "../../../core/ApiResponse";
import { ProtectedRequest } from "../../../types/app-request";
import KeystoreRepo from "../../../database/respository/KeystoreRepo";
import { BadRequestError } from "../../../core/ApiError";

const router = express.Router();


/*-------------------------------------------------------------------------*/
// Below all APIs are private APIs protected for Access Token
router.use('/', authentication);
/*-------------------------------------------------------------------------*/

router.delete(
    "/",
      asyncHandler(async (req: ProtectedRequest, res) => {
        if(!req.keystore) throw new BadRequestError("No keystore in the request object. Please login first.")
        await KeystoreRepo.delete(req.keystore.client);
        new SuccessMsgResponse('Logout success').send(res);
      }),
)

export default router;
