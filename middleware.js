const { professorSchema } = require('./schemas')
const { ExpressError } = require('./utils/ExpressError')
const Professor = require('./models/professor')

 module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be signed in first')
        return res.redirect('/login')
    }
    next()
} 

// professor validation middleware
module.exports.validateProfessor = (req, res, next) => {
    const { error } = professorSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// check if user owns the rating/comment
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params
    const professor = await Professor.findById(id)
    if (!professor.author.equals(res.locals.currentUser._id)) {
        req.flash('error', 'You do not have permission to do that')
        return res.redirect(`/professors/${id}`)
    }
    next()
}