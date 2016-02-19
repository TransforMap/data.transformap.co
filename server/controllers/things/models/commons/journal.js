const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

module.exports = {
  create: function (context) {
    var journal = {
      type: 'journal',
      versions: []
    }
    if (!context) {
      throw error_.new('expected a context', 500, arguments)
    }
    journal.context = context
    return journal
  },
  update: function (journalDoc, newVersionDoc) {
    const versionId = newVersionDoc._id
    if (!_.isUuid(versionId)) {
      throw error_.new('expected version id to be a Couchdb uuid', 500, arguments)
    }
    journalDoc.versions.push(versionId)
    journalDoc.current = newVersionDoc.data
    return journalDoc
  }
}
