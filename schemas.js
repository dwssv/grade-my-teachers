const Joi = require('joi')

module.exports.ratingSchema = Joi.object({
    rating: Joi.object({
        teacher: Joi.string().required(),
        school: Joi.string().required(),
        department: Joi.string().required(),
        comment: Joi.string(),
        quality: Joi.number().integer().required().min(1).max(5),
        difficulty: Joi.number().integer().required().min(1).max(5)
    }).required()
})

