import Joi from "joi";
import { JoiFirebaseId } from "../../../helpers/validator";

export default {
  new: Joi.object().keys({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    department: Joi.string(),
    description: Joi.string().allow(''),
    personal_profiles: Joi.array(),
    projects: Joi.array(),
    accounts_connected: Joi.array(),
    profilePic:Joi.string().uri(),
    year:Joi.number(),
  }),
  findByEmail: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
  update: Joi.object().keys({
    email: Joi.string().email(),
    full_name: Joi.string(),
    department: Joi.string(),
    description: Joi.string().allow(''),
    personal_profiles: Joi.array(),
    projects: Joi.array(),
    accounts_connected: Joi.array(),
    expo_token:Joi.string(),
    fcm_token:Joi.string(),
    profilePic:Joi.string().uri(),
    pwd:Joi.string(),
    year:Joi.number(),
  }),
  byId: Joi.object().keys({
    id: JoiFirebaseId(), //isrequired
  }),
  updatePersonalProfiles: Joi.object().min(1).pattern(/\w/, Joi.string().uri()), //minimum one key
};
