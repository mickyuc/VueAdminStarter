const fs = require('fs')
const path = require('path')
const createError = require('http-errors')
const debug = require('debug')('lifeshare-api:calendars')

const { Sequelize, sequelize } = require('../models')
const Calendar = require('../models/calendar')(sequelize, Sequelize.DataTypes)
const CalendarMember = require('../models/calendarmember')(sequelize, Sequelize.DataTypes)

/**
 * determine display order
 */
module.exports.getMaxDisplayOrder = (req, res, next) => {
  Calendar.findOne({
    attributes: [
      [sequelize.fn('MAX', sequelize.col('displayOrder')), 'displayOrder']
    ],
    where: {
      userId: req.user.id
    },
    raw: true
  })
    .then(data => {
      req.displayOrder = ((data || {}).displayOrder || 0) + 1
      next()
    })
    .catch(err => {
      next(err)
    })
}

/**
 * validate organizer of the calendar
 */
module.exports.isOrganizer = (req, res, next) => {
  Calendar.findOne({
    where: {
      id: req.params.calendarId,
      userId: req.user.id
    }
  })
    .then(data => {
      if (data) {
        req.calendar = data.dataValues
        next()
      } else {
        next(createError(403))
      }
    })
    .catch(err => {
      next(err)
    })
}

/**
 * validate organizer or member of the calendar
 */
module.exports.isOrganizerOrMember = (req, res, next) => {
  Promise.all([
    Calendar.findOne({
      where: {
        id: req.params.calendarId,
        userId: req.user.id
      }
    }),
    CalendarMember.findOne({
      where: {
        calendarId: req.params.calendarId,
        userId: req.user.id
      }
    })
  ])
    .then(data => {
      if (data[0] || data[1]) {
        next()
      } else {
        next(createError(403))
      }
    })
    .catch(err => {
      next(err)
    })
}

/**
 * delete old background image
 */
module.exports.unlinkOldImage = (req, res) => {
  const oldImagePath = path.resolve(__dirname, '..', '.uploads', req.calendar.background)
  if (fs.existsSync(oldImagePath)) {
    fs.unlink(oldImagePath, (err) => {
      if (err) {
        debug('old image deletion', err)
      }
    })
  }
}
