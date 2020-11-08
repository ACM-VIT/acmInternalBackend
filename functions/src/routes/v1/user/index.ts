import express from "express";
import fetchUser from "./fetchUser";
import delUser from "./delUser";
import updateUser from "./updateUser";

const router = express.Router();


router.use("/fetch", fetchUser);
router.use("/update", updateUser);
router.use("/delete", delUser);

export default router;
