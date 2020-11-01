import asyncHandler from "../../../helpers/asyncHandler";
import express from "express";

const router = express.Router();

router.get(
  "/",
  asyncHandler(async (req, res) => {})
);

export default router;
