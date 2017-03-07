const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

const ThingVersion = {
  create: function (doc) {
    _.log(doc, 'model: thing creation doc')

    if (!_.isUuid(doc.journal)) {
      throw error_.new('missing journal id', 500, doc)
    }

    // TODO add userid to doc.userid
    doc.author = 'Douglas Adams'
    doc.description = 'Have fun, and thanks for all the fish!'
    // TODO add license from user profile to doc.copyright

    doc.context = 'version'
    doc.timestamp = _.now()

    _.log(doc, 'model: thing creation formatted doc')
    return doc
  },
  parseCurrentVersion: function (versionDoc) {
    // keeping only the data and not the version metadata
    const data = versionDoc.data
    // faking to return the journal document id
    // while it's just the last version
    data._id = versionDoc.journal

    if(versionDoc.status && versionDoc.status.deleted === true)
      data._deleted = true
    return data
  }
}

module.exports = ThingVersion
