const CONFIG = require('config')
const __ = CONFIG.universalPath
const db = __.require('lib', 'db/db')('poi', 'versions')
const PoiVersion = __.require('models', 'poi_version')

module.exports = {
  create: function (journalId, doc) {
    // keeping a reference to the journal document
    const outer = {
      journal: journalId,
      data: doc
    }
    return db.postAndReturn(PoiVersion.create(outer))
  }
}
