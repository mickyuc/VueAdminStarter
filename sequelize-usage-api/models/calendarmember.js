'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = require('./user')(sequelize, DataTypes)
  const Calendar = require('./calendar')(sequelize, DataTypes)
  const CalendarMember = sequelize.define('CalendarMember', {
    calendarId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {})
  CalendarMember.associate = function (models) {
    // associations can be defined here
  }
  CalendarMember.belongsTo(User, { as: 'member', foreignKey: 'userId' })
  CalendarMember.belongsTo(Calendar, { as: 'calendar', foreignKey: 'calendarId' })
  return CalendarMember
}
