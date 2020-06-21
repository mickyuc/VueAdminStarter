const express = require('express')
const passport = require('passport')

const { authorize } = require('../middlewares/authorize')

const router = express.Router()

router.post('/login', passport.authenticate('json'), (req, res) => {
  res.send()
})

router.get('/user', authorize, (req, res) => {
  const { user } = req
  res.send(user)
})

router.post('/logout', authorize, (req, res) => {
  req.logOut()
  res.send()
})

module.exports = router
