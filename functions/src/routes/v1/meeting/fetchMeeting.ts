import express from 'express';
import { BadRequestError } from '../../../core/ApiError';
import { SuccessResponse } from '../../../core/ApiResponse';
import MeetingRepo from '../../../database/respository/MeetingRepo';
import UserRepo from '../../../database/respository/UserRepo';
import asyncHandler from '../../../helpers/asyncHandler';
import validator, { ValidationSource } from '../../../helpers/validator';
import meetingSchema from './meetingSchema';

const router= express.Router();

router.get(
    "/all",
    asyncHandler(async (req,res) =>{
        const meetings = await MeetingRepo.fetchAll();
        if(!meetings) throw new BadRequestError("no meetings in db");

        new SuccessResponse("All Meetings:",{
            meetings
        }).send(res)
    }),
)

router.get(
    "/all/:pageNum",
    validator(meetingSchema.pageNum,ValidationSource.PARAM),
    asyncHandler(async (req,res) =>{
        const pageNum =parseInt(req.params.pageNum);
        const meetings = await MeetingRepo.fetchAllPaginate(pageNum);
        if(!meetings) throw new BadRequestError("no meetings in db");

        new SuccessResponse("All Meetings paginated:",{
            meetings
        }).send(res)
    }),
)

router.get(
    "/byTitle/:title",
    validator(meetingSchema.title,ValidationSource.PARAM),
    asyncHandler(async (req,res) =>{
        const title =req.params.title;
        const meetings = await MeetingRepo.findByTitle(title);
        if(!meetings) throw new BadRequestError(`no meetings in db with title ${title}`);

        new SuccessResponse(`All Meetings with title ${title}:`,{
            meetings
        }).send(res)
    }),
)

router.get(
    "/byPartialTitle/:title",
    validator(meetingSchema.title,ValidationSource.PARAM),
    asyncHandler(async (req,res) =>{
        const title =req.params.title;
        const meetings = await MeetingRepo.findByTitlePartial(title);
        if(!meetings) throw new BadRequestError(`no meetings in db with statring with ${title}`);

        new SuccessResponse(`All Meetings starting with ${title}:`,{
            meetings
        }).send(res)
    }),
)

router.get(
    "/byPartialTitle/:title/:pageNum",
    validator(meetingSchema.titlePaginate,ValidationSource.PARAM),
    asyncHandler(async (req,res) =>{
        const title =req.params.title;
        const pageNum =parseInt(req.params.pageNum);
        const meetings = await MeetingRepo.findByTitlePartialPaginate(title,pageNum);
        if(!meetings) throw new BadRequestError(`no meetings in db with statring with ${title}`);

        new SuccessResponse(`All Meetings paginated starting with ${title}:`,{
            meetings
        }).send(res)
    }),
)

router.get(
    "/byInitiator/:userId",
    validator(meetingSchema.user,ValidationSource.PARAM),
    asyncHandler(async (req,res) =>{
        const userId =req.params.userId;

        const user = await UserRepo.findById(userId);
        if(!user) throw new BadRequestError(`error: No user found with id ${userId}`);

        const meetings = await MeetingRepo.fetchByInitiator(user);
        if(!meetings) throw new BadRequestError(`no meetings in db initated by ${user.full_name}`);

        new SuccessResponse(`All Meetings intiated by ${user.full_name}:`,{
            meetings
        }).send(res)
    }),
)

router.get(
    "/byInitiatorPaginate/:userId/:pageNum",
    validator(meetingSchema.userPaginate,ValidationSource.PARAM),
    asyncHandler(async (req,res) =>{
        const userId =req.params.userId;
        const pageNum =parseInt(req.params.pageNum);

        const user = await UserRepo.findById(userId);
        if(!user) throw new BadRequestError(`error: No user found with id ${userId}`);

        const meetings = await MeetingRepo.fetchByInitiatorPaginate(user,pageNum);
        if(!meetings) throw new BadRequestError(`no meetings paginated in db initiated by ${user.full_name}`);

        new SuccessResponse(`All Meetings paginatedpm intiated by ${user.full_name}:`,{
            meetings
        }).send(res)
    }),
)


router.get(
    "/byTitleAndStartTime/:title/:start",
    validator(meetingSchema.titleAndStartTime,ValidationSource.PARAM),
    asyncHandler(async (req,res) =>{
        const title =req.params.title;
        const startTime = req.params.start;
        const meetings = await MeetingRepo.findByTitleAndStartTime(title,startTime);
        if(!meetings) throw new BadRequestError(`no meetings in db with title ${title}`);

        new SuccessResponse(`All Meetings with title ${title}:`,{
            meetings
        }).send(res)
    }),
)






export default router;