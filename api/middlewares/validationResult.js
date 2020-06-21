const createError = require('http-errors')
const { validationResult } = require('express-validator')

module.exports = (req, res, next) => {
  const errors = validationResult(req)

  if (errors.isEmpty()) {
    next()
  } else {
    next(createError(422, { errors: errors.array() }))
  }
}
