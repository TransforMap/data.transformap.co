const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

module.exports = function (db, designName) {
  const viewByKeys = function (viewName, keys) {
    return db.view(designName, viewName, {
      keys: keys,
      include_docs: true
    })
    .then(parseNanoResponse)
    .then(parseDocs)
    .then(_.Log(`viewByKeys ${designName} ${viewName} ${keys}`))
  }
  const viewByKeyRange = function (viewName, startKey, endKey, desc = false) {
    return db.view(designName, viewName, {
      startkey: startKey,
      endkey: endKey,
      include_docs: true,
      descending: desc
    })
    .then(parseNanoResponse)
    .then(parseDocs)
    .then(_.Log(`viewByKeyRange ${designName} ${viewName} ${startKey}-${endKey} descending - ${desc}`))
  }

  const get = function (id) {
    return db.get(id)
    .then(parseNanoResponse)
  }
  const insert = function (doc) {
    return db.insert(doc)
    .then(parseNanoResponse)
  }

  const viewDesc = function (viewName) {
    return db.view(designName, viewName, {
      include_docs: true,
      descending: true
    })
    .then(parseNanoResponse)
    .then(parseDocs)
    //.then(_.Log(`view ${designName} ${viewName}`))
  }

  const viewDescWithLimit = function (viewName, limit) {
    return db.view(designName, viewName, {
      include_docs: true,
      descending: true,
      limit: limit
    })
    .then(parseNanoResponse)
    .then(parseDocs)
  }

  return {
    get: get,
    post: insert,
    // returns with the udpated _id and _rev
    postAndReturn: function (doc) {
      return insert(doc)
      .then(_.property('id'))
      .then(get)
    },
    update: function (id, updateFn) {
      return get(id)
      .then(updateFn)
      .then(insert)
      .then(_.Log('update'))
      // TODO: catch insert errors to retry once
      // to address possible conflicts
    },
    viewByKey: function (viewName, key) {
      return viewByKeys(viewName, [key])
      .then(parseFirst)
      .then(_.Log('viewByKey'))
    },
    viewByKeys: viewByKeys,
    viewByKeyRange: viewByKeyRange,
    viewDesc: viewDesc,
    viewDescWithLimit: viewDescWithLimit
  }
}

const parseDocs = function (body) {
  return body.rows.map(_.property('doc'))
}
const parseFirst = function (array) {
  return array[0]
}
// nano returns [body, headers]
// just returning the body
const parseNanoResponse = parseFirst
