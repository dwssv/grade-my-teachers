const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    quality: Number,
    difficulty: Number,
    wouldTakeAgain: Boolean,
    body: String,
    course: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
})

module.exports = mongoose.model('Comment', CommentSchema)