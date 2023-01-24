const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RatingSchema = new Schema({
    teacher: String,
    school: String,
    course: String,
    comment: String,
    quality: Number,
    difficulty: Number
})

module.exports = mongoose.model('Rating', RatingSchema)