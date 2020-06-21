const createError = require('http-errors')
const express = require('express')
const { ObjectId } = require('mongodb')
const { check } = require('express-validator')

const {
  authorize,
  checkStaff,
  checkSudo,
  accessRead,
  accessWrite
} = require('../middlewares/authorize')
const buildQuery = require('../middlewares/buildQuery')
const validationResult = require('../middlewares/validationResult')
const User = require('../models/user')

const router = express.Router()

const createOrUpdateValidator = [
  check('username').notEmpty().withMessage('The username is required'),
  check('username').isLength({ min: 4 }).withMessage('The username must be at least 4 chars long'),
  check('email').notEmpty().withMessage('The email is required'),
  check('email').isEmail().withMessage('The email is not valid'),
  check('role').notEmpty().withMessage('The role is required'),
  // check unique username
  check('username').custom(async (username, { req }) => {
    const filter = { username }
    if (req.params.id) {
      filter._id = { $ne: new ObjectId(req.params.id) }
    }
    if (await User.findOne(filter)) {
      throw new Error('The username has already been taken')
    }
  }),
  // check unique email
  check('email').custom(async (email, { req }) => {
    const filter = { email }
    if (req.params.id) {
      filter._id = { $ne: new ObjectId(req.params.id) }
    }
    if (await User.findOne(filter)) {
      throw new Error('The email has already been taken')
    }
  })
]
const deleteValidator = (req, res, next) => {
  if (req.params.id === req.user._id.toString()) {
    next(createError(400, 'You cannot delete the user you\'ve currently logged in.'))
  } else {
    next()
  }
}

router.use(authorize, checkStaff)

router.get('/', accessRead, buildQuery, async (req, res, next) => {
  try {
    const items = await User.findAll(req.filter, { password: 0 }, req.pagination, req.sort).toArray()
    const totalItems = await User.count(req.filter)
    res.send({ items, totalItems })
  } catch (err) {
    next(err)
  }
})

router.post('/', accessWrite, createOrUpdateValidator, validationResult, async (req, res, next) => {
  try {
    const password = 'p@ssw0rd'
    const { insertedId } = await User.create({ ...req.body, password })

    res.send({ insertedId, message: 'User created successfully.' })
  } catch (err) {
    next(err)
  }
})

router.put('/:id', accessWrite, createOrUpdateValidator, validationResult, async (req, res, next) => {
  try {
    await User.update({ _id: new ObjectId(req.params.id) }, req.body)

    res.send({ message: 'User updated successfully.' })
  } catch (err) {
    next(err)
  }
})

router.delete('/:id', checkSudo, accessWrite, deleteValidator, async (req, res, next) => {
  try {
    await User.remove({ _id: new ObjectId(req.params.id) })

    res.send({ message: 'User deleted successfully.' })
  } catch (err) {
    next(err)
  }
})

module.exports = router
