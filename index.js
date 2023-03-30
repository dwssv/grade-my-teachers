if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsMate = require('ejs-mate')
const session = require('express-session')
const flash = require('connect-flash')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet')

const MongoStore = require('connect-mongo');

// require routes
const userRoutes = require('./routes/users')
const professorsRoutes = require('./routes/professors')
const commentsRoutes = require('./routes/comments')
// const mongoUrl = process.env.DB_URL
const mongoUrl = 'mongodb://127.0.0.1:27017/rate-my-teachers'

// handle initial connection error
mongoose.connect(mongoUrl)
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
app.use(mongoSanitize());

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const store = new MongoStore({
    mongoUrl,
    secret,
    touchAfter:  24 * 60 * 60
})

store.on('error', function(e){
    console.log('session store error', e)
})

const sessionConfig = {
    store: store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        exprires: Date.now() + 1000 * 60 * 60  * 24 * 7,
        maxAge: 1000 * 60 * 60  * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet())
 
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'"],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);


app.use(passport.initialize())
app.use(passport.session())

// see static methods https://www.npmjs.com/package/passport-local-mongoose
// use LocalStrategy to authenticate user
passport.use(new LocalStrategy(User.authenticate()))
// how to store user in session
passport.serializeUser(User.serializeUser())
// how to get user out of session
passport.deserializeUser(User.deserializeUser())

passport.serializeUser(User.serializeUser())

// flash middleware so that we will have access to flash message
app.use((req, res, next) => {
    res.locals.currentUser = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

app.use('/', userRoutes)
app.use('/professors', professorsRoutes)
app.use('/professors/:id/comments', commentsRoutes)

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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('serving!!!')
})