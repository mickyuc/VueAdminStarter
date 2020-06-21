const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const BaseModel = require('./base')
const { db } = require('../services/mongo-client')

module.exports = class User extends BaseModel {
  static get collection () {
    return db.collection('users')
  }

  static findByUsernameOrEmail (usernameOrEmail) {
    return super.findOne({
      $or: [
        { username: usernameOrEmail },
        { email: usernameOrEmail }
      ]
    })
  }

  static create (user) {
    // Generate a salt
    const salt = bcrypt.genSaltSync()
    const hash = bcrypt.hashSync(user.password, salt)
    const password = { hash, salt }

    // Create the default admin user
    return super.create({
      ...user,
      ...{ password }
    })
  }

  static updateLastLoginTime (id) {
    return this.collection.updateOne(
      { _id: new ObjectId(id) },
      {
        $currentDate: {
          lastLoginTime: true
        }
      }
    )
  }

  static comparePassword (password, hash) {
    return bcrypt.compareSync(password, hash)
  }
}
