const express = require('express')
const departments = require('../seeds/departments')
const catchAsync = require('../utils/catchAsync')
const Professor = require('../models/professor')
const { professorSchema } = require('../schemas')
const router = express.Router()

// professor validation middleware
const validateProfessor = (req, res, next) => {
    const { error } = professorSchema.validate(req.body)
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// show all professors
router.get('/', catchAsync(async (req, res) => {
    const professor = await Professor.find({})
    res.render('professors/index', { professor })
}))

// page to add new professor
router.get('/new', (req, res) => {
    res.render('professors/new', { departments })
})

// request to create new professor
router.post('/', validateProfessor, catchAsync(async (req, res) => {
    const professor = new Professor(req.body.professor)
    await professor.save()
    res.redirect(`/professors/${professor._id}`)
}))

// render edit page to edit a professor
router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const professor = await Professor.findById(id)
    res.render('professors/edit', { professor, departments })
}))

// edit a professor
router.put('/:id', validateProfessor, catchAsync(async (req, res) => {
    const { id } = req.params
    const professor = await Professor.findByIdAndUpdate(id, req.body.professor)
    res.redirect(`/professors/${professor._id}`)
}))

// show individual professors
router.get('/:id', catchAsync(async (req, res) => {
    const professor = await Professor.findById(req.params.id).populate('comments')
    res.render('professors/show', { professor })
}))

router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Professor.findByIdAndDelete(id)
    res.redirect('/professors')
}))

module.exports = router