import express from 'express';
import authentication from '../../../auth/authentication';
import { BadRequestError, InternalError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import Meeting, { MeetingStatus } from '../../../database/model/Meeting';
import GoogleMeet from '../../../database/respository/GoogleMeetRepo';
import MeetingRepo from '../../../database/respository/MeetingRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import validator from '../../../helpers/validator';
import { ProtectedRequest } from '../../../types/app-request';
import meetingSchema from './meetingSchema';


const router = express.Router();


router.post(
    "/",
    authentication,
    validator(meetingSchema.new),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { title, about, start } = req.body;
        if (!req.user) throw new BadRequestError("user auth middleware failed");

        const exists = await MeetingRepo.findByTitleAndStartTime(title, start);
        if (exists) throw new BadRequestError(`${title} already scheduled at ${title}`);

        const inputMeet: Meeting = {
            title,
            about,
            start,
            initiator: req.user,
            status: MeetingStatus.CONFIRMED,
        };

        try {
            const event = await GoogleMeet.insertEventIntoCal(inputMeet);
            if (!event) throw new InternalError("error: unable  to create a event in the google calender")
            const meeting = await MeetingRepo.create(inputMeet);
            if (!meeting) throw new InternalError("error: Failed to create a new Meeting");
            new SuccessResponse("Sucessfully added the meeting to calender", {
                meeting,
                event,
            }).send(res);
        } catch (err) {
            throw new InternalError(`Failed to create a google meeting in calender: ${err}`);
        }
    }),
);

export default router;