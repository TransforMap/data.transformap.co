const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const poi_ = __.require('controllers', 'poi/lib/poi')
const versions_ = require('./lib/versions')
const error_ = __.require('lib', 'error')

module.exports = {
  get: function (req, res) {
    const id = req.params.id

    if (! _.isUuid(id)){
      error_.bundle(res, 'invalid id', 400, id)
      return
    }

    poi_.currentVersionById(id)
    .then(res.json.bind(res))
    .catch(error_.Handler(res))
  },
  post: function (req, res) {
    poi_.create(req.body)
    .then(res.json.bind(res))
    .catch(error_.Handler(res))
  }
}
