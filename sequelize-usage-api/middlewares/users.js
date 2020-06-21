const fs = require('fs')
const path = require('path')
const debug = require('debug')('lifeshare-api:users')

/**
 * delete old avatar image
 */
module.exports.unlinkOldImage = (req, res) => {
  if (req.user.avatar) {
    const oldImagePath = path.resolve(__dirname, '..', '.uploads', req.user.avatar)
    if (fs.existsSync(oldImagePath)) {
      fs.unlink(oldImagePath, (err) => {
        if (err) {
          debug('old image deletion', err)
        }
      })
    }
  }
}
