const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProfessorSchema = new Schema({
    first: String,
    last: String,
    department: String,
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

module.exports = mongoose.model('Professor', ProfessorSchema)