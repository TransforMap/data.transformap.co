const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const db = __.require('lib', 'db/db')('things', 'versions')
const Version = require('../things/models/commons/version')

const libUtils = require('../lib_utils')

module.exports = function () {
  const uriBuilder = function (item, baseUri) {
    return `${baseUri}/${item._versionId}`
  }

  const convertArrayToTypeFeatureCollection = function (data_array) {
    return libUtils.convertArrayToFeatureCollection(data_array, 'version', '', uriBuilder )
  }

  return {
    byId: function (id) {
      return db.get(id)
      .then(_.Log('get'))
      .then(libUtils.reject404)
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
