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
    return db.viewByKey('currentVersionById', id)
      .then(_.Log('currentVersionById'))
      .then(PoiVersion.parseCurrentVersion)
  }
}

module.exports = poi_
