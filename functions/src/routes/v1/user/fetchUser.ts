import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";
import { firestoreInstance } from "../../..";
import { user_db } from "../../../constants";
import { SuccessResponse } from "../../../core/ApiResponse";
import Logger from "../../../core/Logger";

const router = express.Router();

router.get(
  "/all",
  asyncHandler(async (req, res) => {
    const allUsers = await firestoreInstance.collection(user_db).get();
    Logger.info(allUsers);
    new SuccessResponse("All Users: ", {
      allUsers,
    }).send(res);
  })
);

export default router;
