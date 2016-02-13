const _ = require('lodash')
const loggers = require('inv-loggers')

const utils = {
  // Couchdb uuid
  isUuid: function (id) {
    if (! _.isString(id)) { return false }
    return /^[0-9a-f]{32}$/.test(id)
  }
}

module.exports = _.extend(utils, _, loggers)
