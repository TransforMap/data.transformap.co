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

const handler = function (res, err) {
  var statusCode = err.statusCode
  const message = err.message

  if (statusCode < 500) {
    if (isCouchError(err)) {
      if (isCouchHardError(err)) {
        _.error(err.request, `couchdb Error: ${err.message}`)
        // re-qualify the error as a 500 as it is the server's fault
        statusCode = 500
      } else {
        _.warn(err.request, message)
      }
    } else {
      _.warn(err.data, message)
    }
    res.status(statusCode).json({status: message})
  } else {
    _.error(err, `request Error: ${err.message}`)
    res.status(statusCode || 500).json({status: message})
  }
}

const isCouchError = function (err) {
  return err.scope === 'couch'
}
// couchdb errors reason that are the server's fault
const isCouchHardError = function (err) {
  return !_.includes(softCouchErrors, err.reason)
}
const softCouchErrors = ['missing']

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
