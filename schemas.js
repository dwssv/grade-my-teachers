const Joi = require('joi')

module.exports.professorSchema = Joi.object({
    professor: Joi.object({
        first: Joi.string().required(),
        last: Joi.string().required(),
        department: Joi.string().required()
    }).required()
})

