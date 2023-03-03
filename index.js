const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/catchAsync')
// const ExpressError = require('./utils/ExpressError ')
const methodOverride = require('method-override')
const Rating = require('./models/rating')
const departments = require('./seeds/departments')

// handle initial connection error
mongoose.connect('mongodb://127.0.0.1:27017/rate-my-teachers')
    .then(() => console.log('mongo connection open!!!!'))
    .catch((e) => console.log('mongo error', e))

// handle error after initial connection was established
const db = mongoose.connection
db.on('error', console.error.bind(console, "connection error:"))
db.once('open', () => console.log('database connected'))

const app = express()

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
// views directory is set to the current working directory (process.cwd()) by default
// joining current directory name of the index file "__dirname" to "/views" enables us to run our app from anywhere because the path to view will be relative to our cwd
app.set('views', path.join(__dirname, '/views'))

// middleware to parse incomming (POST, PUT) request 
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.get('/', (req, res) => {
    res.render('home')
})

// show all ratings
app.get('/ratings', catchAsync(async (req, res) => {
    const ratings = await Rating.find({})
    res.render('ratings/index', { ratings })
}))

// page to add new rating
app.get('/ratings/new', (req, res) => {
    res.render('ratings/new', {departments})
})

app.post('/ratings', catchAsync(async (req, res) => {
    const rating = new Rating(req.body.rating)
    await rating.save()
    res.redirect(`/ratings/${rating._id}`)
}))

app.get('/ratings/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params
    const rating = await Rating.findById(id)
    res.render('ratings/edit', { rating, departments })
}))

app.put('/ratings/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const rating = await Rating.findByIdAndUpdate(id, req.body.rating)
    res.redirect(`/ratings/${rating._id}`)
}))

// show individual ratings
app.get('/ratings/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const rating = await Rating.findById(id)
    res.render('ratings/show', { rating })
}))

app.use((err, req, res, next) => {
     res.send('Something went wrong')
})

app.delete('/ratings/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    await Rating.findByIdAndDelete(id)
    res.redirect('/ratings')
}))

app.listen(3000, () => {
    console.log('serving on port 3000')
})