const mongoose = require('mongoose')
const Rating = require('../models/rating')
const descriptors = require('./descriptors')
const prefixes = require('./prefixes')
const firstnames = require('./firstnames')
const surnames = require('./surnames')

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
            quality: Math.floor(Math.random() * 5) + 1,
            difficulty: Math.floor(Math.random() * 5) + 1
        })
        await rating.save()
    }
}

seedDB().then(() => mongoose.connection.close())