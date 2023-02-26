const mongoose = require('mongoose')
const Rating = require('../models/rating')
const descriptors = require('./descriptors')
const prefixes = require('./prefixes')
const firstnames = require('./firstnames')
const surnames = require('./surnames')
// const { courseNum } = require('./courses')
const departments = require('./departments')

mongoose.connect('mongodb://127.0.0.1:27017/rate-my-teachers')

// handle error after initial connection was established
const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => console.log('database connected'))

const sample = array => array[Math.floor(Math.random() * array.length)]

const seedDB = async () => {
    await Rating.deleteMany({})
    for (let i = 0; i < 50; i++) {
        const rating = new Rating({
            teacher: `${sample(firstnames)} ${sample(surnames)}`,
            school: `${sample(prefixes)} ${sample(descriptors)} School`,
            department: sample(departments),
            comment: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate ipsum est ipsa molestiae illo quod, iure non labore, earum quia excepturi, consectetur cumque necessitatibus quos atque consequatur incidunt totam nihil!',
            quality: Math.floor(Math.random() * 5) + 1,
            difficulty: Math.floor(Math.random() * 5) + 1
        })
        await rating.save()
    }
}

seedDB().then(() => mongoose.connection.close())