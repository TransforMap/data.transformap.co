const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

module.exports = {
  reject404: function (doc) {
    if (!_.isPlainObject(doc)) {
      throw error_.new('no object with this id in db', 404, doc)
    }

    return doc
  },

  rejectEmptyCollection404: function (collection) {
    if (!(collection instanceof Array) || collection.length < 1) {
      throw error_.new('no object with this id in db', 404, collection)
    }

    return collection
  },

  convertArrayToFeatureCollection: function (data_array, item_type, query_string, uri_builder) {
    const hostname = 'https://data.transformap.co'
    var feature_collection = {
      'type': 'FeatureCollection',
      'source': `${hostname}/${item_type}${query_string}`,
      'license': 'Public Domain',
      'features': []
    }

    feature_collection.features = data_array.map((item) => {
      var feature = item.data

      if (!feature.properties) {
        feature.properties = {}
      }
      feature.properties._timestamp = item.timestamp
      feature.properties._id = item.journal
      feature.properties._version = item._id
      feature.properties._uri = uri_builder(item, hostname, item_type)

      return feature
    })

    return feature_collection
  }
}
