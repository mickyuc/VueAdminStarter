const createError = require('http-errors')
const express = require('express')
const upload = require('multer')({ dest: '.uploads' })
const debug = require('debug')('lifeshare-api:calendars')

const router = express.Router()
const { authorize } = require('../middlewares/authorize')
const { getMaxDisplayOrder, isOrganizer, isOrganizerOrMember, unlinkOldImage } = require('../middlewares/calendars')
const { Sequelize, sequelize } = require('../models')
const { Op } = Sequelize
const Calendar = require('../models/calendar')(sequelize, Sequelize.DataTypes)
const CalendarMember = require('../models/calendarmember')(sequelize, Sequelize.DataTypes)

router.use(authorize)

/**
 * Get my calendar list
 */
router.get('/', (req, res, next) => {
  if (req.query.organized === 'true') {
    Calendar.findAll({
      where: {
        userId: req.user.id
      },
      order: [['displayOrder', 'ASC']]
    })
      .then(data => {
        res.send(data)
      })
      .catch(err => {
        next(err)
      })
  } else {
    CalendarMember.findAll({
      where: {
        userId: req.user.id
      },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Calendar,
          as: 'calendar',
          include: ['organizer']
        }
      ]
    })
      .then(data => {
        res.send(data.map(cm => cm.calendar))
      })
      .catch(err => {
        next(err)
      })
  }
})

/**
 * Get calendar details
 */
router.get('/:calendarId', isOrganizerOrMember, (req, res, next) => {
  Promise.all([
    Calendar.findOne({
      where: {
        id: req.params.calendarId
      },
      include: ['organizer']
    }),
    CalendarMember.findAll({
      where: {
        calendarId: req.params.calendarId
      },
      include: ['member']
    })
  ])
    .then((data) => {
      res.send({
        calendar: data[0],
        members: data[1].map(cm => cm.member)
      })
    })
    .catch(err => {
      next(err)
    })
})

/**
 * create a calendar
 */
router.post('/', upload.single('attachment'), getMaxDisplayOrder, (req, res, next) => {
  Calendar.create({
    userId: req.user.id,
    title: req.body.title,
    background: ((req.file || {}).path || '').split('.uploads/')[1],
    muted: /true|1/.test(req.body.muted),
    displayOrder: req.displayOrder
  })
    .then(data => {
      res.send({
        calendar: data,
        message: 'calendar.created'
      })
    })
    .catch(err => {
      next(err)
    })
})

/**
 * update a calendar
 */
router.put('/:calendarId', isOrganizer, upload.single('attachment'), (req, res, next) => {
  const data = {}

  if (req.body.title) {
    data.title = req.body.title
  }
  if (req.body.muted) {
    data.muted = /true|1/.test(req.body.muted)
  }
  if (req.file) {
    data.background = ((req.file || {}).path || '').split('.uploads/')[1]
  }

  // update calendar data
  Calendar.update(data, {
    where: {
      id: req.params.calendarId
    }
  })
    .then(() => {
      const response = {
        message: 'calendar.updated'
      }

      // new background path
      if (req.file) {
        response.calendar = {
          background: data.background
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

/**
 * change display orders
 */
router.put('/orders/:srcId/:dstId', (req, res, next) => {
  Calendar.findAll({
    where: {
      id: {
        [Op.in]: [req.params.srcId, req.params.dstId]
      }
    }
  })
    .then(async data => {
      if (data.length === 2) {
        res.send({
          message: 'calendar.order.updated'
        })

        try {
          const transaction = await sequelize.transaction()
          await Calendar.update({
            displayOrder: data[1].dataValues.displayOrder
          }, {
            where: {
              id: data[0].dataValues.id
            }
          }, { transaction })
          await Calendar.update({
            displayOrder: data[0].dataValues.displayOrder
          }, {
            where: {
              id: data[1].dataValues.id
            }
          }, { transaction })
        } catch (err) {
          debug('change orders', err)
          await transaction.rollback()
        }
      } else {
        next(createError(406))
      }
  })
    .catch(err => {
      next(err)
    })
})

/**
 * delete a calendar
 */
router.delete('/:calendarId', isOrganizer, (req, res, next) => {
  Calendar.destroy({
    where: {
      id: req.params.calendarId
    }
  })
    .then(() => {
      res.send({
        message: 'calendar.deleted'
      })

      next()
    })
    .catch((err) => {
      next(err)
    })
}, unlinkOldImage)

module.exports = router
