const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const db = __.require('lib', 'db/db')('things', 'versions')
const Version = require('../things/models/commons/version')

module.exports = function () {
  const uriBuilder = function (item, baseUri) {
    return `${baseUri}/${item._versionId}`
  }
  const convertArrayToTypeFeatureCollection = function (data_array) {
    return convertArrayToFeatureCollection(data_array, 'version', '', uriBuilder )
  }

  return {
    byId: function (id) {
      return db.get(id)
      .then(_.Log('get'))
      .then(reject404)
      .then(Version.parseCurrentVersion)
    },
    all: function () {
      return db.viewDesc('byTimestamp')
      .then(_.Log('byTimestamp'))
      .then(convertArrayToTypeFeatureCollection)
    },
    latest: function(count) {
      return db.viewDescWithLimit('byTimestamp', count)
      .then(_.Log(`byTimestamp with limit=${count}`))
      .then(convertArrayToTypeFeatureCollection)
    },
    latestSince: function(upTo) {
      const now = (+ new Date())
      return db.viewByKeyRange('byTimestamp', upTo, now)
      .then(_.Log(`byTimestamp since ${ new Date(upTo).toUTCString()}`))
      .then(convertArrayToTypeFeatureCollection)
    }

  }
}

const reject404 = function (doc) {
  if (!_.isPlainObject(doc)) {
    throw error_.new('no object with this id in db', 404, doc)
  }
  return doc
}

const rejectEmptyCollection404 = function (doc) {
  if(!(doc instanceof Array) || doc.length < 1) {
    throw error_.new('no object with this id in db', 404, doc)
  }
  return doc
}

const convertArrayToFeatureCollection = function (data_array, item_type, query_string, uri_builder) {
  const hostname = 'https://data.transformap.co'
  var feature_collection = {
    'type': 'FeatureCollection',
    'source': `${hostname}/${item_type}${query_string}`,
    'license': 'Public Domain',
    'features': []
  }

  feature_collection.features = data_array.map( item => {
    var feature = item.data
    if(!feature.properties)
      feature.properties = {}
    feature.properties._timestamp = item.timestamp
    feature.properties._id = item.journal
    feature.properties._versionId = item._versionId
    feature.properties._uri = uri_builder(item, `${hostname}/${item_type}`)
    return feature;
  })

  return feature_collection
}
