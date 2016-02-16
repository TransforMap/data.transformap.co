const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const promises_ = __.require('lib', 'promises')
const error_ = __.require('lib', 'error')
const db = __.require('lib', 'db/db')('poi', 'versions')
const PoiVersion = __.require('models', 'poi_version')

module.exports = {
  create: function (metaId, doc) {
    // keeping a reference to the meta document
    doc.meta = metaId
    return db.postAndReturn(PoiVersion.create(doc))
  }
}