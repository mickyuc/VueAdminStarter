const createError = require('http-errors')
const { HttpError } = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const cookieSession = require('cookie-session')
const morgan = require('morgan')

const passportService = require('./services/passport')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')

const app = express()

// Middlewares
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: ['C261828D324E8FF2F964CB14F13F9'],
  maxAge: 2 * 60 * 60 * 1000 // 2 hours
}))
app.use(passportService.initialize())
app.use(passportService.session())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/users', usersRouter)
app.use((req, res, next) => {
  next(createError(404, 'API endpoint not found'))
})

// Error handler
app.use((err, req, res, next) => {
  if (err instanceof HttpError) {
    next(err)
  } else {
    next(createError(err.status, err.message))
  }
})
app.use((err, req, res, next) => {
  res.status(err.status)
  res.json(err)
})

module.exports = app
