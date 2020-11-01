import Joi from "joi";

export default {
  new: Joi.object().keys({
    full_name: Joi.string().required(),
    email: Joi.string().required(),
    department: Joi.string().required(),
    description: Joi.string(),
    personal_profiles: Joi.array(),
    projects: Joi.array(),
    accounts_connected: Joi.array(),
  }),
  findByEmail: Joi.object().keys({
    email: Joi.string().required(),
  }),
};
