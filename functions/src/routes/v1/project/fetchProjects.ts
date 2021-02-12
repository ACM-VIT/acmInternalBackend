import express from 'express';
import authentication from "../../../auth/authentication";
import { BadRequestError, NoDataError } from "../../../core/ApiError";
import { SuccessResponse } from "../../../core/ApiResponse";
import Logger from "../../../core/Logger";
import { ProjectStatus } from '../../../database/model/Project';
import ProjectRepo from "../../../database/respository/ProjectRepo";
import TagRepo from '../../../database/respository/TagRepo';
import UserRepo from "../../../database/respository/UserRepo";
import asyncHandler from "../../../helpers/asyncHandler";
import validator, { ValidationSource } from "../../../helpers/validator";
import projectSchema from "./projectSchema";

const router = express.Router();

router.use("/", authentication);

router.get(
    "/all",
    asyncHandler(async (req, res) => {
        const allProjects = await ProjectRepo.fetchAll();
        if (!allProjects) throw new BadRequestError(`No projects retrieved in db`);

        new SuccessResponse(`Projects:`, {
            allProjects
        }).send(res);
    })
)

router.get(
    "/all/:pageNum",
    validator(projectSchema.byPageNum, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        let pn: number = parseInt(req.params.pageNum)
        const allProjects = await ProjectRepo.fetchAllPaginate(pn);
        if (!allProjects) throw new BadRequestError(`No projects retrieved in db`);

        new SuccessResponse(`Projects:`, {
            allProjects
        }).send(res);
    })
)

router.get(
    "/tags/all",
    asyncHandler(async (req, res) => {
        const allTags = await TagRepo.fetchAll();
        if (!allTags) throw new BadRequestError(`No tags retrieved in db`);

        new SuccessResponse(`Tags:`, {
            allTags
        }).send(res);
    }),
)

router.get(
    "/byStatus/:status",
    validator(projectSchema.byStatus, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const allProjects = await ProjectRepo.findByStatus(req.params.status as ProjectStatus);
        if (!allProjects) throw new BadRequestError(`No projects retrieved in db with status: ${req.params.status}`);

        new SuccessResponse(`Projects with status: ${req.params.status}`, {
            allProjects
        }).send(res);
    })
)
router.get(
    "/byStatus/:status/:pageNum",
    validator(projectSchema.byStatusPaginate, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const pageNum: number = parseInt(req.params.pageNum);
        const allProjects = await ProjectRepo.findByStatusPaginate(req.params.status as ProjectStatus, pageNum);
        if (!allProjects) throw new BadRequestError(`No projects retrieved in db with status: ${req.params.status}`);

        new SuccessResponse(`Projects with status: ${req.params.status}`, {
            allProjects
        }).send(res);
    })
)

router.get(
    "/byUserAndStatus/:userId/:status",
    validator(projectSchema.byStatusAndUser, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const user = await UserRepo.findById(req.params.id)
        if (!user) throw new BadRequestError(`no user of id: ${req.params.userId} exists`);


        const allProjects = await ProjectRepo.findByStatusAndUser(req.params.status as ProjectStatus, user);
        if (!allProjects) throw new BadRequestError(`No projects retrieved in db with status and user: ${req.params.status} and ${user.full_name}`);

        new SuccessResponse(`Projects with status and user: ${req.params.status} and ${user.full_name}`, {
            allProjects
        }).send(res);
    })
)

router.get(
    "/byUserAndStatus/:userId/:status/:pageNum",
    validator(projectSchema.byStatusAndUserPaginate, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const pageNum: number = parseInt(req.params.pageNum);

        const user = await UserRepo.findById(req.params.id)
        if (!user) throw new BadRequestError(`no user of id: ${req.params.userId} exists`);


        const allProjects = await ProjectRepo.findByStatusAndUserPaginate(req.params.status as ProjectStatus, user, pageNum);
        if (!allProjects) throw new BadRequestError(`No projects retrieved in db with status and user: ${req.params.status} and ${user.full_name}`);

        new SuccessResponse(`Projects with status and user: ${req.params.status} and ${user.full_name}`, {
            allProjects
        }).send(res);
    })
)




router.get(
    "/byTag/:tag",
    validator(projectSchema.byTag, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const allProjects = await ProjectRepo.findByTag(req.params.tag);
        if (!allProjects) throw new BadRequestError(`No projects retrieved in db with tag: ${req.params.tag}`);

        new SuccessResponse(`Projects with tag: ${req.params.tag}`, {
            allProjects
        }).send(res);
    })
)

router.get(
    "/byTag/:tag/:pageNum",
    validator(projectSchema.ByTagPaginate, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        let pageNum: number = parseInt(req.params.pageNum);
        const allProjects = await ProjectRepo.findByTagPaginate(req.params.tag, pageNum);
        if (!allProjects) throw new BadRequestError(`No projects retrieved in db with tag: ${req.params.tag}`);

        new SuccessResponse(`Projects with tag: ${req.params.tag}`, {
            allProjects
        }).send(res);
    })
)


router.get(
    "/byFounder/:id",
    validator(projectSchema.byId, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const user = await UserRepo.findById(req.params.id);
        if (!user) throw new BadRequestError(`No such user with id: ${req.params.id}`);
        const allProjects = await ProjectRepo.findByFounder(user.full_name);
        if (!allProjects) throw new NoDataError(`No projects by the user or user not part of any projects`);

        new SuccessResponse(`Projects of user id: ${req.params.id}`, {
            allProjects
        }).send(res);
    }),
)

router.get(
    "/byFounder/:id/:pageNum",
    validator(projectSchema.byIdPaginate, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const user = await UserRepo.findById(req.params.id);
        if (!user) throw new BadRequestError(`No such user with id: ${req.params.id}`);

        let pageNum: number = parseInt(req.params.pageNum);
        const allProjects = await ProjectRepo.findByFounderPaginate(user.full_name, pageNum);
        if (!allProjects) throw new NoDataError(`No projects by the user or user not part of any projects`);

        new SuccessResponse(`Projects of user id: ${req.params.id}`, {
            allProjects
        }).send(res);
    }),
)
router.get(
    "/byUser/:id",
    validator(projectSchema.byId, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const user = await UserRepo.findById(req.params.id);
        if (!user) throw new BadRequestError(`No such user with id: ${req.params.id}`);
        if (!user.id) throw new NoDataError(`No id in user: ${req.params.id}`);
        const allProjects = await ProjectRepo.findByUser(user.id);
        if (!allProjects) throw new NoDataError(`No projects by the user or user not part of any projects`);

        new SuccessResponse(`Projects of user id: ${req.params.id}`, {
            allProjects
        }).send(res);
    }),
)

router.get(
    "/byUser/:id/:pageNum",
    validator(projectSchema.byIdPaginate, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const user = await UserRepo.findById(req.params.id);
        if (!user) throw new BadRequestError(`No such user with id: ${req.params.id}`);
        if (!user.id) throw new NoDataError(`No id in user: ${req.params.id}`);
        let pageNum: number = parseInt(req.params.pageNum);
        const allProjects = await ProjectRepo.findByUserPaginate(user.id, pageNum);
        if (!allProjects) throw new NoDataError(`No projects by the user or user not part of any projects`);

        new SuccessResponse(`Projects of user id: ${req.params.id}`, {
            allProjects
        }).send(res);
    }),
)

router.get(
    "/byId/:id",
    validator(projectSchema.byId, ValidationSource.PARAM),
    asyncHandler(async (req, res) => {
        const docId = req.params.id;

        const project = await ProjectRepo.findById(docId);
        if (!project) throw new BadRequestError(`No project with the id ${docId}`);

        new SuccessResponse(`Project with id ${docId}`, {
            project
        }).send(res);
    })
)

router.get(
    "/byName/:name",
    asyncHandler(async (req, res) => {
        const projectName = req.params.name;
        Logger.info(projectName);
        const project = await ProjectRepo.findByName(projectName);
        if (!project)
            throw new BadRequestError(
                `Project ${projectName} does not exist in db`
            );

        new SuccessResponse(`Project with name: ${projectName}`, {
            project
        }).send(res);
    })
)



export default router;
