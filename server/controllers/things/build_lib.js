const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const db = __.require('lib', 'db/db')('things', 'journals')
const Journal = require('./models/commons/journal')
const Version = require('./models/commons/version')
const versions_ = require('./lib/versions')
const promises_ = __.require('lib', 'promises')
const error_ = __.require('lib', 'error')

module.exports = function (typeName, model) {
  return {
    byId: function (id) {
      return db.viewByKey('byId', [typeName, id])
      .then(_.Log(`${typeName} byId`))
    },
    filter: function(filter_string) {
      const convertArrayToTypeFeatureCollection = function (data_array) {
        return convertArrayToFeatureCollection(data_array,typeName)
      }
      if(filter_string == '') {
        return db.viewByKeyRange('currentVersionById', [typeName, '0'], [typeName, 'z'])
        .then(convertArrayToTypeFeatureCollection)
        .then(_.Log(`${typeName} filter all`))
      } else {
        const key = filter_string.replace(/=.*$/,''),
              value = filter_string.split('=')[1]

        var startkey, endkey
        if(value) {
          startkey = [typeName, key, value]
          endkey = startkey
        } else {
          startkey = [typeName, key, ' ']
          endkey =  [typeName, key, '\u9999']
        }
        return db.viewByKeyRange('byAttribute', startkey, endkey)
        .then(convertArrayToTypeFeatureCollection)
        .then(_.Log(`${typeName} filter byAttribute "${key}"="${value}"`))
      }

    },
    create: function (data) {
      // first make sure we have valid data
      // we don't want to create a journal or anything if the data isn't valid
      try {
        model.validateData(data)
      } catch (err) {
        // A function should either return sync values
        // or async values (as a promise) but never both.
        // So, to stay consistant, we return a rejected promise
        // instead of just throwing the error
        return promises_.reject(err)
      }

      // then knowning that the data is valid, create a journal document
      return db.post(Journal.create(typeName))
      .then(_.Log('journal post res'))
      // extracting the journalId
      .then(_.property('id'))
      // then create a first version document and update the journal
      .then(_.partial(updateJournal, data))
      .then(_.Log('thing created'))
      .catch(_.ErrorRethrow('thing creation err'))
    },
    currentVersionById: function (id) {
      // there is some magic happening in the currentVersionById view (see db/design_docs/journal.json):
      // as the journal document emits the id of another document in the format {'_id': lastVersionId},
      // using the parameter include_doc will not return the emitting document but the document with the id doc.current._id.
      // This is called Linked documents https://wiki.apache.org/couchdb/Introduction_to_CouchDB_views#Linked_documents
      // The complex key [typeName, id] allows to make sure we don't
      // return a document that doesn't belong to the required type
      return db.viewByKey('currentVersionById', [typeName, id])
      .then(_.Log('currentVersionById'))
      .then(reject404)
      .then(Version.parseCurrentVersion)
    },
    update: function (data, journalId) {
      // same as in create
      try {
        model.validateData(data)
      } catch (err) {
        return promises_.reject(err)
      }

      if (!_.isUuid(journalId)) {
        return promises_.reject(`err in update, path not an uuid: '${journalId}'`)
      }
      return db.viewByKey('byId', [typeName, journalId])
      // DB will return just 'undefined' if nothing is found
      .then(reject404)
      // Insert version object into journal.
      // journalId and data are already available
      // but we need to wait for the validation
      // to execute updateJournal, thus the partial
      .then(_.partial(updateJournal, data, journalId))
      .then(_.Log('thing updated'))
      .catch(_.ErrorRethrow('thing update err'))
    },
    delete: function (journalId) {
      if (!_.isUuid(journalId)) {
        return promises_.reject(`err in update, path not an uuid: '${journalId}'`)
      }
      _.log(journalId, 'update with id')

      return db.viewByKey('byId', [typeName, journalId])
      // DB will return just 'undefined' if nothing is found
      .then(function (journal) {
        _.log(journal, 'delete: got journal')
        if (!_.isPlainObject(journal)) {
          throw error_.new('no object with this id in db', 404, journal)
        }
        if (_.isPlainObject(journal.status) && journal.status.deleted === true) {
          throw error_.new('already deleted', 208, journal) // "already reported", borrowed from WebDAV
        }
        if (!_.isPlainObject(journal.status)) {
          journal['status'] = { deleted: true }
        } else {
          journal.status.deleted = true
        }
        return versions_.create(journalId, journal.data, journal.status)
      })
      // insert version object into journal
      .then(function (newVersionObject) {
        return db.update(journalId, function (journalDoc) {
          return Journal.update(journalDoc, newVersionObject)
        })
      })
      .then(_.Log('return value of insert'))
    }
  }
}

const reject404 = function (doc) {
  if (!_.isPlainObject(doc)) {
    throw error_.new('no object with this id in db', 404, doc)
  }
  return doc
}

const updateJournal = function (data, journalId) {
  // create a new version associated to this journal
  return versions_.create(journalId, data)
  // then update the journal document to reference the new version
  .then(function (newVersionObject) {
    return db.update(journalId, function (journalDoc) {
      return Journal.update(journalDoc, newVersionObject)
    })
  })
}

const convertArrayToFeatureCollection = function (data_array, item_type) {
  const hostname = 'https://data.transformap.co'
  var feature_collection = {
    'type': 'FeatureCollection',
    'source': hostname, // only temporarly here
    'license': 'Public Domain',              // -||-
    'features': []
  }
  data_array.forEach( item => {
    var feature = item.data
    if(!feature.properties)
      feature.properties = {}
    feature.properties._uri = hostname + '/' + item_type + '/' + item.journal
    feature.properties._timestamp = item.timestamp
    feature.properties._id = item.journal
    feature_collection.features.push(feature)
  })
  return feature_collection
}
