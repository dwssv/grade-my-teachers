const Joi = require('joi')

module.exports.professorSchema = Joi.object({
    professor: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required(),
        department: Joi.string().required()
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        quality: Joi.number().integer().min(1).max(5).required(),
        difficulty: Joi.number().integer().min(1).max(5).required(),
        wouldTakeAgain: Joi.boolean().required(),
        body: Joi.string().required(),
        course: Joi.string().required()
    }).required()
})