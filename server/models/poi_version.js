const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const geojson = require('geojson-tools')

const PoiVersion = {
  create: function (doc) {
    _.log(doc, 'poi creation doc')

    if (!_.isUuid(doc.meta)) {
      throw error_.new('missing meta id', 500, doc)
    }
    const geojson_testresult = geojson.isGeoJSON(doc.geojson, true)
    if (geojson_testresult !== true) {
      throw error_.complete(geojson_testresult, 400, doc)
    }
    const lat = doc.geojson.geometry.coordinates[0]
    const lon = doc.geojson.geometry.coordinates[1]
    if (lat < -90 || lat > 90) {
      throw error_.new('coordinate lat out of range', 400, doc)
    }
    if (lon < -180 || lon > 360) {
      throw error_.new('coordinate lon out of range', 400, doc)
    }
    if (doc.geojson.properties.name == null || doc.geojson.properties.name === '') {
      throw error_.new('missing name', 400, doc)
    }

    // TODO add userid to doc.userid
    // TODO add license from user profile to doc.copyright

    doc.type = 'version'
    doc.timestamp = _.now()
    doc.version = 1

    _.log(doc, 'poi creation formatted doc')
    return doc
  },
  parseCurrentVersion: function (versionDoc) {
    const metaId = versionDoc.meta
    versionDoc = _.omit(versionDoc, privateAttributes)
    // faking to return the meta document
    // while it's just the last version
    versionDoc._id = metaId
    return versionDoc
  }
}

// attributes that should not be returned to the end user
const privateAttributes = ['type', 'meta', '_id', '_rev']

module.exports = PoiVersion
