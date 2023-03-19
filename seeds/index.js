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
            author: '64157d00094fc381531705b4'
        })
        await professor.save()
    }
}

seedProfessor().then(() => mongoose.connection.close())

