import Joi from 'joi'

export default {
    new: Joi.object().keys({
        title: Joi.string().required(),
        about: Joi.string().required(),
        start: Joi.date().iso().required(),
    }),
}