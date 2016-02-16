const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const db = __.require('lib', 'db/db')('poi', 'poi')
const PoiMeta = __.require('models', 'poi_meta')
const PoiVersion = __.require('models', 'poi_version')
const versions_ = require('./versions')

const poi_ = {
  byId: function (id) {
    return db.viewByKey('byId', id)
      .then(_.Log('poi byId'))
  },
  create: function (doc) {
    // first create a meta document
    return db.post(PoiMeta.create())
      .then(_.Log('meta post res'))
      // then create a first version document
      .then(function (res) {
        const metaId = res.id
        return versions_.create(metaId, doc)
          // then update the meta document to reference the first version
          .then(function (firstVersionDoc) {
            return db.update(metaId, function (metaDoc) {
              return PoiMeta.update(metaDoc, firstVersionDoc)
            })
          })
      })
      .then(_.Log('poi created'))
      .catch(_.ErrorRethrow('poi creation err'))
  },
  currentVersionById: function (id) {
    // there is some magic happening in the currentVersionById view (see db/design_docs/poi.json):
    // as the meta document emits the id of another document in the format {'_id': doc.current._id},
    // using the parameter include_doc will not return the emitting document but the document with the id doc.current._id.
    // This is called Linked documents https://wiki.apache.org/couchdb/Introduction_to_CouchDB_views#Linked_documents
    return db.viewByKey('currentVersionById', id)
      .then(_.Log('currentVersionById'))
      .then(PoiVersion.parseCurrentVersion)
  }
}

module.exports = poi_
