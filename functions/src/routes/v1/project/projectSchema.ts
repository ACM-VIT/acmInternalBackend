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
    wanted: Joi.array().items(Joi.string().required().min(1)).min(1),
    resources: Joi.object().min(1).pattern(/\w/, Joi.string().uri()), //minimum one key;
    status: Joi.any()
      .required()
      .valid(...status),
    teamMembers: Joi.array()
      .items(Joi.string().email().required().min(1))
      .min(1),
  }),
  byId:Joi.object().keys({
    id:Joi.string().required()
  }),
  byName:Joi.object().keys({
    name:Joi.string().required()
  }),
};
