const CONFIG = require('config')
const __ = CONFIG.universalPath
const db = __.require('lib', 'db/db')('poi', 'versions')
const PoiVersion = __.require('models', 'poi_version')

module.exports = {
  create: function (journalId, data) {
    // wrapping the data in a larger document
    // to add version metadata
    const wrapper = {
      // keeping a reference to the journal document
      journal: journalId,
      data: data
    }
    return db.postAndReturn(PoiVersion.create(wrapper))
  }
}

