import Joi from 'joi'

export default {
    auth: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),
}