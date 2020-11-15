import Joi from 'joi';


export default {
    login: Joi.object().keys({
        full_name: Joi.string().required(),
        email: Joi.string().email().required(),
        department: Joi.string(),
        description: Joi.string(),
        personal_profiles: Joi.array(),
        projects: Joi.array(),
        accounts_connected: Joi.array(),
    }),
    auth: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),

}