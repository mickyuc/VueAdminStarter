const crypto = require('crypto')
const express = require('express')
const upload = require('multer')({ dest: '.uploads' })

const router = express.Router()
const { signin, authorize } = require('../middlewares/authorize')
const { unlinkOldImage } = require('../middlewares/users')
const { Sequelize, sequelize } = require('../models')
const User = require('../models/user')(sequelize, Sequelize.DataTypes)

/**
 * update user profile and retrive jwt token
 */
router.post('/login', (req, res, next) => {
  User.findOrCreate({
    where: {
      deviceId: req.body.deviceId
    },
    defaults: {
      deviceId: req.body.deviceId,
      inviteId: crypto.createHash('md5').update(req.body.deviceId).digest('hex').toString()
    }
  }).then((data) => {
    req.user = data[0].dataValues
    next()
  }).catch((err) => {
    next(err)
  })
}, signin)

/**
 * update user profile
 */
router.put('/', authorize, upload.single('attachment'), (req, res, next) => {
  const data = {
    name: req.body.name
  }

  if (req.file) {
    data.avatar = ((req.file || {}).path || '').split('.uploads/')[1]
  }

  User.update(data, {
    where: {
      id: req.user.id
    }
  })
    .then(() => {
      const response = {
        message: 'profile.updated'
      }

      // new avatar path
      if (req.file) {
        response.user = {
          avatar: data.avatar
        }
      }

      res.send(response)

      if (req.file) {
        next()
      }
    })
    .catch((err) => {
      next(err)
    })
}, unlinkOldImage)

module.exports = router
