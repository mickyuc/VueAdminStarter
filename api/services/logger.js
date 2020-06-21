const debug = require('debug')

module.exports.debug = (namespace, message) => debug(namespace)(message)

module.exports.error = (namespace, message) => debug(namespace)(message)
