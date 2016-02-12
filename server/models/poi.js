const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

module.exports = {
  create: function (doc) {
    var name = doc.name
    if (name == null || name === '' ) {
      throw new Error('missing name')
    }
    return doc
  }
}
