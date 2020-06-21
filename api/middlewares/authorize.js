const createError = require('http-errors')

function authorize (req, res, next) {
  if (req.user) {
    next()
  } else {
    next(createError(401, 'Unauthorized'))
  }
}

function checkSudo (req, res, next) {
  if (req.user.role === 'sudo') {
    next()
  } else {
    next(createError(403, 'Permission denied'))
  }
}

function checkStaff (req, res, next) {
  if (/sudo|staff/.test(req.user.role)) {
    next()
  } else {
    next(createError(403, 'Permission denied'))
  }
}

function accessWrite (req, res, next) {
  if (req.user.access === 'w') {
    next()
  } else {
    next(createError(403, 'Access denied'))
  }
}

function accessRead (req, res, next) {
  if (/r|w/.test(req.user.access)) {
    next()
  } else {
    next(createError(403, 'Access denied'))
  }
}

module.exports = {
  authorize,
  checkSudo,
  checkStaff,
  accessWrite,
  accessRead
}
