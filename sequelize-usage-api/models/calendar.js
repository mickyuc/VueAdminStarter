'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = require('./user')(sequelize, DataTypes)
  const Calendar = sequelize.define('Calendar', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    background: DataTypes.STRING,
    displayOrder: DataTypes.INTEGER,
    muted: DataTypes.BOOLEAN
  }, {})
  Calendar.associate = function (models) {
    // associations can be defined here
  }
  Calendar.belongsTo(User, { as: 'organizer', foreignKey: 'userId' })
  return Calendar
}
