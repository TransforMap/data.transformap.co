const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const promises_ = __.require('lib', 'promises')
const error_ = __.require('lib', 'error')
const db = __.require('lib', 'db/db')('poi', 'poi')
const PoiVersion = __.require('models', 'poi_version')
const PoiMeta = __.require('models', 'poi_meta')

const poi_ = {
  byId: function (id){
    return db.viewByKey('byId', id)
      .then(_.Log('poi byId'))
  },
  create: function (doc) {
    // first create a meta document
    return db.post(PoiMeta.create())
      .then(_.Log('meta post res'))
      // then create a first version document
      .then(function (res) {
        metaId = res.id
        // keeping a reference to the meta document
        doc.meta = metaId
        return db.postAndReturn(PoiVersion.create(doc))
          // then update the meta document to reference the first version
          .then(function (firstVersionDoc) {
            return db.update(metaId, function (metaDoc){
              return PoiMeta.update(metaDoc, firstVersionDoc)
            })
          })
      })
      .then(_.Log('poi created'))
      .catch(_.ErrorRethrow('poi creation err'))
  }
}

module.exports = poi_