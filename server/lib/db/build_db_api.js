const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

module.exports = function (db, designName) {
  const viewByKeys = function (viewName, keys) {
    return db.view(designName, viewName, {
        keys: keys,
        include_docs: true
      })
      .then(parseNanoResponse)
      .then(parseDocs)
      .then(_.Log('viewByKeys'))
  }

  return {
    get: function (id) {
      return db.get(id)
        .then(parseNanoResponse)
    },
    post: function (doc) {
      return db.insert(doc)
        .then(parseNanoResponse)
    },
    viewByKey: function (viewName, key) {
      return viewByKeys(viewName, [key])
        .then(parseFirst)
        .then(_.Log('viewByKey'))
    },
    viewByKeys: viewByKeys
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
