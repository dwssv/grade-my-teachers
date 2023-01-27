const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Rating = require('./models/rating')

// handle initial connection error
mongoose.connect('mongodb://127.0.0.1:27017/rate-my-teachers')
    .then(() => console.log('mongo connection open!!!!'))
    .catch((e) => console.log('mongo error', e))

// handle error after initial connection was established
const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => console.log('database connected'))

const app = express()

app.set('view engine', 'ejs')
// views directory is set to the current working directory (process.cwd()) by default
// joining current directory name of the index file "__dirname" to "/views" enables us to run our app from anywhere because the path to view will be relative to our cwd
app.set('views', path.join(__dirname, '/views'))

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/addrating', async (req, res) => {
    const rate = new Rating({
        teacher: 'Geoffrey McGraw',
        school: 'Piboonbumpen Demonstration School, Burapha University',
        course: 'E33102',
        comment: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        quality: 5,
        difficulty: 3
    })
    await rate.save()
    res.send(rate)
})

app.listen(3000, () => {
    console.log('serving on port 3000')
})
