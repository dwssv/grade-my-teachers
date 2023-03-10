const mongoose = require('mongoose')

// Professor 
const Professor = require('../models/professor')
const firstnames = require('./firstnames')
const surnames = require('./surnames')
const departments = require('./departments')

// Comment
const Comment = require('../models/comment')
const subjects = ['ST', 'MA', 'TH', 'EN', 'SO', 'AR', 'AT', 'PE']
const courseCode = () => {
    const subject = subjects[Math.floor(Math.random() * subjects.length)]
    let code = ''
    for (let i = 0; i < 5; i++) {
        code = code + Math.floor(Math.random() * 10)
    }
    return `${subject}${code}`
}

mongoose.connect('mongodb://127.0.0.1:27017/rate-my-teachers')

// handle error after initial connection was established
const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => console.log('database connected'))

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedProfessor = async () => {
    await Professor.deleteMany({})
    for (let i = 0; i < 20; i++) {
        const professor = new Professor({
            first: sample(firstnames),
            last:  sample(surnames),
            department: sample(departments),
        })
        await professor.save()
    }
}

// const seedComment = async () => {
//     await Comment.deleteMany({})
//     for (let i = 0; i < 100; i++) {
//         const comment = new Comment({
//             quality: Math.floor(Math.random() * 5) + 1,
//             difficulty: Math.floor(Math.random() * 5) + 1,
//             wouldTakeAgain: Math.floor(Math.random() * 2),
//             contentText: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate ipsum est ipsa molestiae illo quod, iure non labore, earum quia excepturi, consectetur cumque necessitatibus quos atque consequatur incidunt totam nihil!',
//             courseCode: courseCode(),
//             // professor: 'Professor X'
//         })
//         await comment.save()
//     }
// }



seedProfessor().then(() => mongoose.connection.close())
// seedComment()
