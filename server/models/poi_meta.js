const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

module.exports = {
  create: function () {
    return {
      type: 'meta',
      refs: []
    }
  },
  update: function (metaDoc, newVersionDoc) {
    const versionId = newVersionDoc._id
    if (!_.isUuid(versionId)) {
      throw error_.new('expected version id to be a Couchdb uuid', 500, arguments)
    }
    metaDoc.refs.push(versionId)
    metaDoc.current = _.omit(newVersionDoc, 'meta')
    return metaDoc
  }
}
