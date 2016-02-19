const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const geojson = require('geojson-tools')

module.exports = {
  validateData: function (data) {
    const geojsonTestResult = geojson.isGeoJSON(data, true)
    // if the test fails, returns an error object
    if (geojsonTestResult !== true) {
      throw error_.complete(geojsonTestResult, 400, data)
    }
    const lat = data.geometry.coordinates[0]
    const lon = data.geometry.coordinates[1]
    if (lat < -90 || lat > 90) {
      throw error_.new('coordinate lat out of range', 400, data)
    }
    if (lon < -180 || lon > 360) {
      throw error_.new('coordinate lon out of range', 400, data)
    }
    if (!_.isNonEmptyString(data.properties.name)) {
      throw error_.new('missing name', 400, data)
    }
    return data
  }
}
