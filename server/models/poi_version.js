const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

module.exports = {
  create: function (doc) {
    _.log(doc, 'poi creation doc')

    if (!_.isUuid(doc.meta)) {
      throw error_.new('missing meta id', 500, doc)
    }
    if (doc.name == null || doc.name === '') {
      throw error_.new('missing name', 400, doc)
    }
    if (doc.lat == null || doc.lon == null) {
      throw error_.new('missing coordinate/s', 400, doc)
    }
    if (typeof doc.lat !== 'number' || typeof doc.lon !== 'number') {
      throw error_.new('coordinates not of type number', 400, doc)
    }
    if (doc.lat < -90 || doc.lat > 90) {
      throw error_.new('coordinate lat out of range', 400, doc)
    }
    if (doc.lon < -180 || doc.lon > 360) {
      throw error_.new('coordinate lon out of range', 400, doc)
    }
    if (doc.status) {
      throw new Error('status tag not allowed, used only for deleted/obsolete objects')
    }

    // TODO add userid to doc.userid
    // TODO add license from user profile to doc.copyright

    doc.type = 'version'
    doc.timestamp = _.now()
    doc.version = 1

    _.log(doc, 'poi creation formatted doc')
    return doc
  }
}
