'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    deviceId: DataTypes.STRING,
    name: DataTypes.STRING,
    avatar: DataTypes.STRING,
    inviteId: DataTypes.STRING
  }, {})
  User.associate = function (models) {
    // associations can be defined here
  }
  return User
}
