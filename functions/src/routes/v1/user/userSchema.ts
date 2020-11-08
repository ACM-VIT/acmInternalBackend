import Joi from "joi";
import { JoiFirebaseId } from "../../../helpers/validator";

export default {
  new: Joi.object().keys({
    full_name: Joi.string().required(),
    email: Joi.string().email().required(),
    department: Joi.string(),
    description: Joi.string(),
    personal_profiles: Joi.array(),
    projects: Joi.array(),
    accounts_connected: Joi.array(),
  }),
  findByEmail: Joi.object().keys({
    email: Joi.string().email().required(),
  }),
  update: Joi.object().keys({
    email: Joi.string().email(),
    full_name: Joi.string(),
    department: Joi.string(),
    description: Joi.string(),
    personal_profiles: Joi.array(),
    projects: Joi.array(),
    accounts_connected: Joi.array(),
  }),
  byId: Joi.object().keys({
    id: JoiFirebaseId(), //isrequired
  }),
  updatePersonalProfiles: Joi.object().min(1).pattern(/\w/, Joi.string().uri()), //minimum one key
};
