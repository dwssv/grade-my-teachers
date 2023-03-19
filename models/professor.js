const mongoose = require('mongoose')
const Comment = require('./comment')
const Schema = mongoose.Schema

const ProfessorSchema = new Schema({
    first: String,
    last: String,
    department: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
})

// middleware to delete other things associated with deleted professor such as comments
// runs after deleted
// deleted object passed in
ProfessorSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Comment.deleteMany({
            _id: {
                $in: doc.comments
            }
        })
    }
})

module.exports = mongoose.model('Professor', ProfessorSchema)