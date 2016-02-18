const CONFIG = require('config')
const __ = CONFIG.universalPath
const store = __.require('lib', 'store/store')('poi', 'versions')
const PoiVersion = __.require('models', 'poi_version')

module.exports = {
  create: function (journalId, doc) {
    // keeping a reference to the journal document
    const outer = {
      journal: journalId,
      data: doc
    }
    return store.postAndReturn(PoiVersion.create(outer))
  }
}
