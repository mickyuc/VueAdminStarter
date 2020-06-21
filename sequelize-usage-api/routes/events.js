const express = require('express')

const router = express.Router({ mergeParams: true })

const { authorize } = require('../middlewares/authorize')
const { isOrganizer } = require('../middlewares/calendars')
const { Sequelize, sequelize } = require('../models')
const { gte, lt, and } = Sequelize.Op
const Event = require('../models/event')(sequelize, Sequelize.DataTypes)

router.use(authorize)

/**
 * Get events in calendar
 */
router.get('/', (req, res, next) => {
  const startTime = new Date(req.query.year, req.query.month - 1, 1).getTime()
  const endTime = new Date(req.query.year, req.query.month, 1).getTime()

  Event.findAll({
    where: {
      calendarId: req.params.calendarId,
      time: {
        [and]: {
          [gte]: startTime,
          [lt]: endTime
        }
      }
    },
    order: [['time', 'ASC']]
  })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      next(err)
    })
})

/**
 * create an event
 */
router.post('/', isOrganizer, (req, res, next) => {
  Event.create({
    userId: req.user.id,
    calendarId: req.params.calendarId,
    stamp: req.body.stamp,
    time: req.body.time
  })
    .then(data => {
      res.send({
        calendar: data,
        message: 'event.created'
      })
    })
    .catch(err => {
      next(err)
    })
})

/**
 * update an event
 */
router.put('/:eventId', isOrganizer, (req, res, next) => {
  Event.update(req.body, {
    where: {
      id: req.params.eventId
    }
  })
    .then(() => {
      res.send({
        message: 'event.updated'
      })
    })
    .catch(err => {
      next(err)
    })
})

/**
 * delete an event
 */
router.delete('/:eventId', isOrganizer, (req, res, next) => {
  Event.destroy({
    where: {
      id: req.params.eventId
    }
  })
    .then(() => {
      res.send({
        message: 'event.deleted'
      })
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
