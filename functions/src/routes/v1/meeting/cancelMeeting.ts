import express from 'express';
import authentication from '../../../auth/authentication';
import { BadRequestError, InternalError, NoDataError } from '../../../core/ApiError';
import { SuccessMsgResponse } from '../../../core/ApiResponse';
import GoogleMeet from '../../../database/respository/GoogleMeetRepo';
import MeetingRepo from '../../../database/respository/MeetingRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import validator from '../../../helpers/validator';
import meetingSchema from './meetingSchema';

const router = express.Router();


router.post(
    "/",
    authentication,
    validator(meetingSchema.cancel),
    asyncHandler(async (req, res) => {
        const title: string = req.body.title;
        const meeting = await MeetingRepo.findByTitle(title);
        if (!meeting) throw new BadRequestError(`meeting with title ${title} does not exist`);
        if (!meeting.id) throw new NoDataError(`id not defined in the meeting of title ${title}`);
        if (!meeting.calEventId) throw new NoDataError(`google calender id[calEventId field]not defined in the meeting of title ${title}`);


        try {
            await GoogleMeet.deleteEvent(meeting.calEventId);
            await MeetingRepo.deleteMeeting(meeting.id);
            new SuccessMsgResponse("Successfully deleted/cancelled the event").send(res);
        } catch (err) {
            throw new InternalError(`failed to delete the meeting: ${meeting.title}`);
        }

    })
)
export default router;
