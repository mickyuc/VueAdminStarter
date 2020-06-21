const { MongoClient } = require('mongodb')
const logger = require('./logger')

class Client {
  async connect (uri, callback) {
    try {
      const client = await MongoClient.connect(uri || 'mongodb://127.0.0.1:27017', {
        useUnifiedTopology: true
      })

      logger.debug('api:mongodb', 'Connected to MongoDB')

      this._db = client.db('csgofair')

      // Load User model
      const User = require('../models/user')

      // Check if the default admin user exists
      const user = await User.findByUsernameOrEmail('admin')

      if (user) {
        logger.debug('api:mongodb', 'The default admin user exists')
      } else {
        logger.debug('api:mongodb', 'Creating the default admin user...')

        // Create the default admin user
        await User.create({
          email: 'admin@csgofair.com',
          username: 'admin',
          password: 'p@ssw0rd',
          role: 'sudo', // 'sudo' | 'staff' | 'customer'
          access: 'w' // 'w' | 'r'
        })

        logger.debug('api:mongodb', 'The default user has been created!')
      }

      callback(null)
    } catch (err) {
      callback(err)
    }
  }

  collection (name) {
    return this._db.collection(name)
  }
}

const client = new Client()

module.exports.connect = async (uri, callback) => {
  client.connect(uri, callback)
}

module.exports.db = client
