const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

module.exports = {
  validateData: function (data) {
    if (!_.isNonEmptyString(data.name)) {
      throw error_.new('Name attribute missing.', 400, data)
    }
  }
}
