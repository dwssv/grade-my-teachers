const BaseJoi = require('joi')
const sanitizeHtml = require('sanitize-html');

// validation to exclude html from string input
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.professorSchema = Joi.object({
    professor: Joi.object({
        first: Joi.string().required().escapeHTML(),
        last: Joi.string().required().escapeHTML(),
        department: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.commentSchema = Joi.object({
    comment: Joi.object({
        quality: Joi.number().integer().min(1).max(5).required(),
        difficulty: Joi.number().integer().min(1).max(5).required(),
        wouldTakeAgain: Joi.boolean().required(),
        body: Joi.string().required().escapeHTML(),
        course: Joi.string().required().escapeHTML() 
    }).required()
})