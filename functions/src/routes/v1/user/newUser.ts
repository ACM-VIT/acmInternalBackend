import express from "express";
import { firestoreInstance } from "../../../index";
import { user_db } from "../../../constants";
import { SuccessResponse } from "../../../core/ApiResponse";
import asyncHandler from "../../../helpers/asyncHandler";

const router = express.Router();

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const createdUser = await firestoreInstance.collection(user_db).add({
      name: "Gokul J Kurup",
    });
    new SuccessResponse("Sucessfully created user", {
      createdUser,
    }).send(res);
  })
);
export default router;
