import express from "express";
import newUser from "./newUser";
import fetchUser from "./fetchUser";

const router = express.Router();

router.use("/new", newUser);
router.use("/fetch", fetchUser);

export default router;
