const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const promises_ = __.require('lib', 'promises')
const error_ = __.require('lib', 'error')
const db = __.require('lib', 'db/db')('poi')
const Poi = __.require('models', 'poi')

module.exports = {
  byId: function (id){
    return db.get(id)
      .then(_.Log('poi byId'))
  },
  create: function (doc) {
    return promises_.start
      .then(() => Poi.create(doc))
      .then(db.post)
      .then(_.Log('poi created'))
  }
}
