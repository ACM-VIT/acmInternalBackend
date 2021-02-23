import Joi from 'joi'

export default {
    new: Joi.object().keys({
        title: Joi.string().required(),
        about: Joi.string().required(),
        start: Joi.date().iso().required(),
    }),
    cancel: Joi.object().keys({
        title: Joi.string().required(),
    }),
    pageNum:Joi.object().keys({
        pageNum: Joi.string().required(),
    }),
    title:Joi.object().keys({
        title: Joi.string().required(),
    }),
    titlePaginate:Joi.object().keys({
        title: Joi.string().required(),
        pageNum: Joi.string().required(),
    }),
    user:Joi.object().keys({
        userId: Joi.string().required(),
    }),
    userPaginate:Joi.object().keys({
        userId: Joi.string().required(),
        pageNum: Joi.string().required(),
    }),
    titleAndStartTime:Joi.object().keys({
        title: Joi.string().required(),
        start:Joi.date().iso().required(),
    }),
}
