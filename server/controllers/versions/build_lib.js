const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const db = __.require('lib', 'db/db')('things', 'versions')
const Version = require('../things/models/commons/version')

const libUtils = require('../lib_utils')

module.exports = function () {
  const uriBuilder = function (item, hostname, item_type) {
    return `${hostname}/${item_type}/${item.journal}/version/${item._id}`
  }

  const convertArrayToTypeFeatureCollection = function (resultArray, route) {
    return libUtils.convertArrayToFeatureCollection(resultArray, 'place', route, uriBuilder)
  }

  const replaceCreatedVersions = function (data) {
    return libUtils.replaceCreated(data, db)
  }

  return {
    byId: function (id) {
      return db.get(id)
      .then(_.Log('get'))
      .then(libUtils.reject404)
      .then((data) => libUtils.appendCreated([data]))
      .then(libUtils.unpack)
      .then((data) => replaceCreatedVersions([data]))
      .then(libUtils.unpack)
      .then(Version.parseCurrentVersion)
    },
    all: function () {
      return db.viewDesc('byTimestamp')
      .then(_.Log('byTimestamp'))
      .then(libUtils.appendCreated)
      .then(replaceCreatedVersions)
      .then((data) => convertArrayToTypeFeatureCollection(data, ''))
    },
    latest: function (count) {
      return db.viewDescWithLimit('byTimestamp', count)
      .then(_.Log(`byTimestamp with limit=${count}`))
      .then(libUtils.appendCreated)
      .then(replaceCreatedVersions)
      .then((data) => convertArrayToTypeFeatureCollection(data, '/latest/' + count))
    },
    latestSince: function (upTo) {
      const now = (+new Date())
      return db.viewByKeyRange('byTimestamp', upTo, now)
      .then(_.Log(`byTimestamp since ${new Date(upTo).toUTCString()}`))
      .then(libUtils.appendCreated)
      .then(replaceCreatedVersions)
      .then((data) => convertArrayToTypeFeatureCollection(data, '/since/' + upTo))
    }
  }
}
