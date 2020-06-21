const createError = require('http-errors')

const { Sequelize, sequelize } = require('../models')
const User = require('../models/user')(sequelize, Sequelize.DataTypes)
const Calendar = require('../models/calendar')(sequelize, Sequelize.DataTypes)
const CalendarMember = require('../models/calendarmember')(sequelize, Sequelize.DataTypes)

/**
 * Get organizer id from inviteId
 */
module.exports.getOrganizer = (req, res, next) => {
  User.findOne({
    where: {
      inviteId: req.params.inviteId
    }
  })
    .then((data) => {
      if (data) {
        req.organizer = data.dataValues
        next()
      } else {
        next(createError(403))
      }
    })
    .catch((err) => {
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
      userId: (req.organizer || req.user).id
    },
    include: ['organizer']
  })
    .then(data => {
      if (data) {
        req.calendar = data
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
 * check if he has already accepted the invitation
 */
module.exports.isAccepted = (req, res, next) => {
  CalendarMember.findOne({
    where: {
      calendarId: req.params.calendarId,
      userId: req.user.id
    }
  })
    .then((data) => {
      if (data) {
        next(createError(409))
      } else {
        next()
      }
    })
    .catch(err => {
      next(err)
    })
}

/**
 * check if he is a member of the calendar
 */
module.exports.isMember = (req, res, next) => {
  CalendarMember.findOne({
    where: {
      calendarId: req.params.calendarId,
      userId: req.user.id
    }
  })
    .then(data => {
      if (data) {
        next()
      } else {
        next(createError(403))
      }
    })
    .catch(err => {
      next(err)
    })
}
