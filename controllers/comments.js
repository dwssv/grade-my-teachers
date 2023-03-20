const Comment = require('../models/comment')
const Professor = require('../models/professor')

module.exports.createComment = async (req, res) => {
    const professor = await Professor.findById(req.params.id)
    const comment = new Comment(req.body.comment)
    comment.author = req.user._id
    professor.comments.push(comment)
    await comment.save()
    await professor.save()
    req.flash('success', 'Sucessfully added a comment!')
    res.redirect(`/professors/${professor._id}`)
}

module.exports.deleteComment = async (req, res) => {
    const {id, commentId} = req.params
    Professor.findByIdAndUpdate(id, {$pull: {comments: commentId}})
    await Comment.findByIdAndDelete(commentId)
    req.flash('success', 'Sucessfully deleted a comment!')
    res.redirect(`/professors/${id}`)
}