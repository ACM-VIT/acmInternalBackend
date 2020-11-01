import express from "express";
import newUser from "./newUser";
import fetchUser from "./fetchUser";
import delUser from "./delUser";

const router = express.Router();

router.use("/new", newUser);
router.use("/fetch", fetchUser);
router.use("/delete", delUser);

export default router;
