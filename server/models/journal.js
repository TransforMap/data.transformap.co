const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

module.exports = {
  create: function (className) {
    var journal = {
      type: 'journal',
      refs: []
    }
    if (className !== 'undefined') {
      journal.class = className
    }
    return journal
  },
  update: function (journalDoc, newVersionDoc) {
    const versionId = newVersionDoc._id
    if (!_.isUuid(versionId)) {
      throw error_.new('expected version id to be a Couchdb uuid', 500, arguments)
    }
    journalDoc.refs.push(versionId)
    journalDoc.current = newVersionDoc.data
    return journalDoc
  }
}
