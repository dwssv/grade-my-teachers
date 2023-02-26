const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RatingSchema = new Schema({
    teacher: String,
    school: String,
    department: String,
    comment: String,
    quality: Number,
    difficulty: Number
})

module.exports = mongoose.model('Rating', RatingSchema)