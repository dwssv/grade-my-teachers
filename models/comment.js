const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CommentSchema = new Schema({
    quality: Number,
    difficulty: Number,
    wouldTakeAgain: Boolean,
    contentText: String,
    courseCode: String,
    professor: {
        type: Schema.Types.ObjectId,
        ref: 'Professor'
    } 
})

module.exports = mongoose.model('Comment', CommentSchema)