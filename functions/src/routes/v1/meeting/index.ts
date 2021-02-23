import express from 'express';
import cancelMeeting from './cancelMeeting';
import newMeeting from './newMeeting';
import fetchMeeting from './fetchMeeting'

const router = express.Router();


router.use("/new", newMeeting);
router.use("/cancel", cancelMeeting);
router.use("/fetch",fetchMeeting);


export default router;