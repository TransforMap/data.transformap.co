const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

module.exports = {
  create: function (type) {
    if (!type) {
      throw error_.new('expected a type', 500, arguments)
    }
    var journal = {
      context: 'journal',
      type: type,
      versions: []
    }
    return journal
  },
  update: function (journalDoc, newVersionDoc) {
    const versionId = newVersionDoc._id
    if (!_.isUuid(versionId)) {
      throw error_.new('expected version id to be a Couchdb uuid', 500, arguments)
    }
    journalDoc.versions.push(versionId)
    journalDoc.data = newVersionDoc.data
    if (newVersionDoc.status) {
      journalDoc.status = newVersionDoc.status
    } else //status not supplied, delete in journal
      if (journalDoc.status)
        delete journalDoc.status
    return journalDoc
  }
}
