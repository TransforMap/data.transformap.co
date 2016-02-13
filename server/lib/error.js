const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const formatError = function (err, status, data) {
  err.statusCode = status
  err.data = data
  return err
}

const newErr = function (message, status, data) {
  return formatError(new Error(message), status, data)
}

handler = function (res, err) {
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

module.exports = {
  new: newErr,
  complete: formatError,
  Complete: function (status, data) {
    return function (err) {
      throw formatError(err, status, data)
    }
  },
  bundle: function (res, message, status, data) {
    const err = newErr(message, status, data)
    handler(res, err)
  },
  Handler: function (res) {
    return _.partial(handler, res)
  }
}
