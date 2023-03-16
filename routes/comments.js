const express = require('express')
const router = express.Router({mergeParams: true})

const Comment = require('../models/comment')
const Professor = require('../models/professor')

const catchAsync = require('../utils/catchAsync')
const ExpressError = require('../utils/ExpressError')

const { commentSchema } = require('../schemas')


// comment validation middleware
const validateComment = (req, res, next) => {
    const { error } = commentSchema.validate(req.body)
    if (error) { 
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

// create comment
router.post('/', validateComment, catchAsync(async (req, res) => {
    const professor = await Professor.findById(req.params.id)
    const comment = new Comment(req.body.comment)
    professor.comments.push(comment)
    await comment.save()
    await professor.save()
    req.flash('success', 'Sucessfully added a comment!')
    res.redirect(`/professors/${professor._id}`)
}))

// Delete comment
router.delete('/:commentId', catchAsync(async (req, res) => {
    const {id, commentId} = req.params
    Professor.findByIdAndUpdate(id, {$pull: {comments: commentId}})
    await Comment.findByIdAndDelete(commentId)
    req.flash('success', 'Sucessfully deleted a comment!')
    res.redirect(`/professors/${id}`)
}))

module.exports = router;