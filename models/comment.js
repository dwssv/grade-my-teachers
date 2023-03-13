const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    quality: Number,
    difficulty: Number,
    wouldTakeAgain: Boolean,
    body: String,
    course: String
})

module.exports = mongoose.model('Comment', CommentSchema)