const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const formatError = function (err, status, data) {
  err.statusCode = status
  err.data = data
  return err
}

module.exports = {
  new: function (message, status, data) {
    return formatError(new Error(message), status, data)
  },
  complete: formatError,
  Complete: function (status, data) {
    return function (err) {
      throw formatError(err, status, data)
    }
  },
  Handler: function (res) {
    return function (err) {
      const statusCode = err.statusCode
      const message = err.message
      if (statusCode < 500) {
        _.warn(err.data, message)
        res.status(statusCode).json({status: message})
      } else {
        _.error(err, 'handler')
        res.status(statusCode || 500).json({status: message})
      }
    }
  }
}
