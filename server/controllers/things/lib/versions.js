const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const db = __.require('lib', 'db/db')('things', 'versions')
const Version = require('../models/commons/version')

module.exports = {
  create: function (journalId, data, status) {
    console.log('lib/version: got journalId: ', journalId)
    console.log('lib/version: got data: ', data)
    console.log('lib/version: got status: ', status)
    _.log(`lib/version: got journalId '$(journalId)'`)
    // wrapping the data in a larger document
    // to add version metadata
    const wrapper = {
      // keeping a reference to the journal document
      journal: journalId,
      data: data
    }
    if(status) {
      wrapper.status = status
    }
    return db.postAndReturn(Version.create(wrapper))
  }
}

