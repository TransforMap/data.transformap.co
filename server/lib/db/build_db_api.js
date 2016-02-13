const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

module.exports = function (db) {
  return {
    get: function (id) {
      return db.get(id)
        .spread(parseNanoResponse)
    },
    post: function (doc) {
      return db.insert(doc)
        .spread(parseNanoResponse)
    }
  }
}

// just returning the body
const parseNanoResponse = function (body, header) {
  return body
}