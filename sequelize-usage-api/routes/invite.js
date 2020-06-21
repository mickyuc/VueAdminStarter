const express = require('express')

const { authorize } = require('../middlewares/authorize')
const { getOrganizer, isOrganizer, isAccepted, isMember } = require('../middlewares/invite')
const { Sequelize, sequelize } = require('../models')
const CalendarMember = require('../models/calendarmember')(sequelize, Sequelize.DataTypes)

const router = express.Router({ mergeParams: true })

router.use(authorize)

/**
 * Accept invitation to a calendar
 */
router.post('/:inviteId', getOrganizer, isOrganizer, isAccepted, (req, res, next) => {
  CalendarMember.create({
    calendarId: req.params.calendarId,
    userId: req.user.id
  })
    .then((data) => {
      res.send({
        calendar: req.calendar,
        message: 'invite.accepted'
      })
    })
    .catch(err => {
      next(err)
    })
})

/**
 * Remove invited user from calendar
 */
router.delete('/users/:userId/revoke', isOrganizer, (req, res, next) => {
  CalendarMember.destroy({
    where: {
      calendarId: req.params.calendarId,
      userId: req.params.userId
    }
  })
    .then(() => {
      res.send({
        message: 'invite.user.revoked'
      })
    })
    .catch(err => {
      next(err)
    })
})

/**
 * Get rid of invited calendar
 */
router.delete('/revoke', isMember, (req, res, next) => {
  CalendarMember.destroy({
    where: {
      calendarId: req.params.calendarId,
      userId: req.user.id
    }
  })
    .then(() => {
      res.send({
        message: 'invite.revoked'
      })
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
