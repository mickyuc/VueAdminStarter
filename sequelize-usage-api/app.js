const createError = require('http-errors')
const { HttpError } = require('http-errors')
const express = require('express')
const cookieParser = require('cookie-parser')
const morgan = require('morgan')
const debug = require('debug')('lifeshare-api:app')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const calendarsRouter = require('./routes/calendars')
const eventsRouter = require('./routes/events')
const inviteRouter = require('./routes/invite')
const imagesRouter = require('./routes/images')

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/calendars/:calendarId/invite', inviteRouter)
app.use('/calendars/:calendarId/events', eventsRouter)
app.use('/calendars', calendarsRouter)
app.use('/images', imagesRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404))
})

// error handler
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

  debug(err)
})

module.exports = app
