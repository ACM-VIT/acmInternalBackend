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
    loginByPwd:Joi.object().keys({
      email:Joi.string().email().required(),
      pwd:Joi.string().required(),
    }),
    auth: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),
    byEmail:Joi.object().keys({
      email:Joi.string().email().required()
    }),
    refreshToken: Joi.object().keys({
      refreshToken: Joi.string().required().min(1),
    }),

}