const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

module.exports = function (db) {
  return {
    post: function (doc) {
      return db.insert(doc)
        // just returning the body
        .spread((body, header) => body )
    }
  }
}