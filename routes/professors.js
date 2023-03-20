const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateProfessor, isAuthor } = require('../middleware')
const professors = require('../controllers/professors')

router.get('/', catchAsync(professors.index))

router.get('/new', isLoggedIn, professors.renderNewForm)

router.post('/', isLoggedIn, validateProfessor, catchAsync(professors.createProfessor))

router.get('/:id', catchAsync(professors.showProfessor))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(professors.renderEditForm))

router.put('/:id', isLoggedIn, isAuthor, validateProfessor, catchAsync(professors.editProfessor))

router.delete('/:id', isLoggedIn, isAuthor,  catchAsync(professors.deleteProfessor))

module.exports = router