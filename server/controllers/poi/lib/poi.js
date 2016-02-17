const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const db = __.require('lib', 'db/db')('poi', 'poi')
const Journal = __.require('models', 'journal')
const PoiVersion = __.require('models', 'poi_version')
const versions_ = require('./versions')

const poi_ = {
  byId: function (id) {
    return db.viewByKey('byId', id)
      .then(_.Log('poi byId'))
  },
  create: function (doc) {
    // first create a journal document
    return db.post(Journal.create('poi'))
      .then(_.Log('journal post res'))
      // then create a first version document
      .then(function (res) {
        const journalId = res.id
        return versions_.create(journalId, doc)
          // then update the journal document to reference the first version
          .then(function (firstVersionDoc) {
            return db.update(journalId, function (journalDoc) {
              return Journal.update(journalDoc, firstVersionDoc)
            })
          })
      })
      .then(_.Log('poi created'))
      .catch(_.ErrorRethrow('poi creation err'))
  },
  currentVersionById: function (id) {
    // there is some magic happening in the currentVersionById view (see db/design_docs/poi.json):
    // as the journal document emits the id of another document in the format {'_id': doc.current._id},
    // using the parameter include_doc will not return the emitting document but the document with the id doc.current._id.
    // This is called Linked documents https://wiki.apache.org/couchdb/Introduction_to_CouchDB_views#Linked_documents
    return db.viewByKey('currentVersionById', id)
      .then(_.Log('currentVersionById'))
      .then(PoiVersion.parseCurrentVersion)
  }
}

module.exports = poi_
