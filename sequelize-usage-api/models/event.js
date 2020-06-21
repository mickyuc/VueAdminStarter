'use strict'
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    userId: DataTypes.INTEGER,
    calendarId: DataTypes.INTEGER,
    stamp: DataTypes.INTEGER,
    time: DataTypes.BIGINT
  }, {})
  Event.associate = function (models) {
    // associations can be defined here
  }
  return Event
}
