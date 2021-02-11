import express from 'express';
import cancelMeeting from './cancelMeeting';
import newMeeting from './newMeeting';
const router = express.Router();


router.use("/new", newMeeting);
router.use("/cancel", cancelMeeting);


export default router;