import express from 'express';
import newMeeting from './newMeeting';

const router = express.Router();


router.use("/new", newMeeting);


export default router;