import Joi from 'joi'

export default {
    auth: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),
    discordAuth: Joi.object()
    .keys({
      discord_token:Joi.string().required(),
    })
    .unknown(true),
}