const express = require('express')
const router = express.Router()
const catchAsync = require('../utils/catchAsync')
const { isLoggedIn, validateProfessor, isAuthor } = require('../middleware')
const professors = require('../controllers/professors')

router.route('/')
    .get(catchAsync(professors.index))
    .post(isLoggedIn, validateProfessor, catchAsync(professors.createProfessor))

router.get('/new', isLoggedIn, professors.renderNewForm)

router.route('/:id')
    .get(catchAsync(professors.showProfessor))
    .put(isLoggedIn, isAuthor, validateProfessor, catchAsync(professors.editProfessor))
    .delete(isLoggedIn, isAuthor,  catchAsync(professors.deleteProfessor))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(professors.renderEditForm))

module.exports = router