import Joi from "joi";
import { ProjectStatus } from "../../../database/model/Project";

const status = [
  ProjectStatus.IDEATION,
  ProjectStatus.IN_PROGRESS,
  ProjectStatus.REVIEW,
  ProjectStatus.COMPLETED,
];

export default {
  new: Joi.object().keys({
    name: Joi.string().required().min(1),
    desc: Joi.string().required().min(1),
    image: Joi.string().min(1),
    tags: Joi.array().items(Joi.string()),
    wanted: Joi.array().items(Joi.string().required().min(1)).min(1),
    resources: Joi.object().min(1).pattern(/\w/, Joi.string().uri()), //minimum one key;
    status: Joi.any()
      .valid(...status),
    teamMembers: Joi.array()
      .items(Joi.string().email().required().min(1))
      .min(1),
    icon: Joi.string().min(1),
  }),
  byId: Joi.object().keys({
    id: Joi.string().required()
  }),
  byIdPaginate: Joi.object().keys({
    id: Joi.string().required(),
    pageNum: Joi.string().required()
  }),
  byName: Joi.object().keys({
    name: Joi.string().required()
  }),
  byTag: Joi.object().keys({
    tag: Joi.string().required()
  }),
  byStatus: Joi.object().keys({
    status: Joi.string().valid(...status).required()
  }),
  byStatusPaginate: Joi.object().keys({
    status: Joi.string().valid(...status).required(),
    pageNum: Joi.string().required(),
  }),
  byStatusAndUser: Joi.object().keys({
    status: Joi.string().valid(...status).required(),
    userId: Joi.string().required(),
  }),
  byStatusAndUserPaginate: Joi.object().keys({
    status: Joi.string().valid(...status).required(),
    userId: Joi.string().required(),
    pageNum: Joi.string().required(),
  }),
  ByTagPaginate: Joi.object().keys({
    tag: Joi.string().required(),
    pageNum: Joi.string().required()
  }),
  byPageNum: Joi.object().keys({
    pageNum: Joi.string().required()
  }),
  update: Joi.object().keys({
    name: Joi.string().min(1),
    desc: Joi.string().min(1),
    status: Joi.any()
      .valid(...status),
    teamMembers: Joi.array()
      .items(Joi.string().email().required().min(1))
      .min(1),
  }).required(),
  updateResource: Joi.object().min(1).pattern(/\w/, Joi.string().uri()).required(), //minimum one key;
  updateWanted: Joi.object().min(1).pattern(/\w/, Joi.string().required()),
};
