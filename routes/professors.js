const express = require('express')
const router = express.Router()

const catchAsync = require('../utils/catchAsync')

const Professor = require('../models/professor')
const departments = require('../seeds/departments')
const { isLoggedIn, validateProfessor, isAuthor } = require('../middleware')

// show all professors
router.get('/', catchAsync(async (req, res) => {
    const professor = await Professor.find({})
    res.render('professors/index', { professor })
}))

// page to add new professor
router.get('/new', isLoggedIn, (req, res) => {
    res.render('professors/new', { departments })
})

// request to create new professor
router.post('/', isLoggedIn, validateProfessor, catchAsync(async (req, res) => {
    const professor = new Professor(req.body.professor)
    professor.author = req.user._id
    await professor.save()
    req.flash('success', 'Sucessfully added a new professor!')
    res.redirect(`/professors/${professor._id}`)
}))

// render edit page to edit a professor
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params
    const professor = await Professor.findById(id)
    if (!professor) {
        req.flash('error', 'Cannot find that professor')
        return res.redirect('/professors')
    }
    res.render('professors/edit', { professor, departments })
}))

// edit a professor
router.put('/:id', isLoggedIn, isAuthor, validateProfessor, catchAsync(async (req, res) => {
    const { id } = req.params
    const professor = await Professor.findByIdAndUpdate(id, req.body.professor)
    req.flash('success', 'Sucessfully edited a professor!')
    res.redirect(`/professors/${professor._id}`)
}))

// show individual professors
router.get('/:id', catchAsync(async (req, res) => {
    const professor = await Professor.findById(req.params.id).populate('comments')
    if (!professor) {
        req.flash('error', 'Cannot find that professor')
        return res.redirect('/professors')
    }
    res.render('professors/show', { professor })
}))

router.delete('/:id', isLoggedIn, isAuthor,  catchAsync(async (req, res) => {
    const { id } = req.params
    await Professor.findByIdAndDelete(id)
    req.flash('success', 'Sucessfully deleted a professor!')
    res.redirect('/professors')
}))

module.exports = router