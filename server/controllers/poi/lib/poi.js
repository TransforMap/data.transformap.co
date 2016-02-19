const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const db = __.require('lib', 'db/db')('poi', 'poi')
const Journal = __.require('models', 'journal')
const PoiVersion = __.require('models', 'poi_version')
const versions_ = require('./versions')
const promises_ = __.require('lib', 'promises')

const poi_ = {
  byId: function (id) {
    return db.viewByKey('byId', id)
    .then(_.Log('poi byId'))
  },
  create: function (data) {
    // first make sure we have valid data
    // we don't want to create a journal or anything if the data isn't valid
    try {
      PoiVersion.validateData(data)
    } catch (err) {
      // A function should either return sync values
      // or async values (as a promise) but never both.
      // So, to stay consistant, we return a rejected promise
      // instead of just throwing the error
      return promises_.reject(err)
    }

    // then knowning that the data is valid, create a journal document
    return db.post(Journal.create('poi'))
    .then(_.Log('journal post res'))
    // then create a first version document
    .then(function (res) {
      const journalId = res.id
      return versions_.create(journalId, data)
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
    .then(function (doc) {
      if (doc == null) {
        throw error_.new('missing doc', 404, id)
      }
      return doc
    })
    .then(PoiVersion.parseCurrentVersion)
  },
  update: function (data, journalId) {
    try { // same as in create
      PoiVersion.validateData(data)
    } catch (err) {
      return promises_.reject(err)
    }

    if (!_.isUuid(journalId)) {
      return promises_.reject('err in update, path not an uuid: \'' + journalId + '\'')
    }

    return db.viewByKey('byId', journalId)
    // DB will return just 'undefined' of nothing found
    .then(function (doc) {
      if (typeof (doc) !== 'object') {
        throw error_.new('no object with this id in db', 404, doc)
      }
      return doc
    })
    .then(_.Log('byId'))
    // check if supplied UUID is a version object of type poi
    .then(function (doc) {
      if (doc.type !== 'journal' || doc.class !== 'poi') {
        console.log(doc)
        throw error_.new('uuid not of existing journal type=poi', 404, doc)
      }
      return doc
    })
    // check okay, create version object
    .then(() => versions_.create(journalId, data))
    // insert version object into journal
    .then(function (newVersionObject) {
      return db.update(journalId, function (journalDoc) {
        return Journal.update(journalDoc, newVersionObject)
      })
    })
    .then(_.Log('retval of insert'))
    .catch(_.ErrorRethrow('db insert error'))
  }
}

module.exports = poi_
