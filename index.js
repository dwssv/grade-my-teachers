const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')

// require routes
const professors = require('./routes/professors')
const comments = require('./routes/comments')

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
// public directories hold static files such as javascript, css, and images
// the browser can access these files hence the name "public "
app.use(express.static(path.join(__dirname, 'public')))

// session configuration objects
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        exprires: Date.now() + 1000 * 60 * 60  * 24 * 7,
        maxAge: 1000 * 60 * 60  * 24 * 7
    }
}
app.use(session(sessionConfig))

app.use('/professors', professors)
app.use('/professors/:id/comments', comments)

app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err
    if (!err.message) {
        err.message = 'Something went wrong'
    }
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('serving on port 3000')
})