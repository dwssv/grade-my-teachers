const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfessorSchema = new Schema({
    first: String,
    last: String,
    department: String,
})

module.exports = mongoose.model('Professor', ProfessorSchema)