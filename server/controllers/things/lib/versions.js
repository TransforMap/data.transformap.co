const CONFIG = require('config')
const __ = CONFIG.universalPath
const db = __.require('lib', 'db/db')('things', 'versions')
const Version = require('../models/commons/version')

module.exports = {
  create: function (journalId, data) {
    // wrapping the data in a larger document
    // to add version metadata
    const wrapper = {
      // keeping a reference to the journal document
      journal: journalId,
      data: data
    }
    return db.postAndReturn(Version.create(wrapper))
  }
}

