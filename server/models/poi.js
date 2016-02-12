const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

module.exports = {
  create: function (doc) {
    if (doc.type !== 'poi') {
      throw new Error('not of type POI')
    }
    var name = doc.name
    if (name == null || name === '') {
      throw new Error('missing name')
    }
    if (doc.lat == null || doc.lon == null) {
      throw new Error('missing coordinate/s')
    }
    if (typeof doc.lat !== 'number' || typeof doc.lon !== 'number') {
      throw new Error('coordinates not of type number')
    }
    if (doc.lat < -90 || doc.lat > 90) {
      throw new Error('coordinate lat out of range')
    }
    if (doc.lon < -180 || doc.lon > 360) {
      throw new Error('coordinate lon out of range')
    }
    if (doc.status) {
      throw new Error('status tag not allowed, used only for deleted/obsolete objects')
    }

    // TODO add userid to doc.userid
    // TODO add license from user profile to doc.copyright

    doc.timestamp = _.now()
    doc.version = 1

    return doc
  }
}
