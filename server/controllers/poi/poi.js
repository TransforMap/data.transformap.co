const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const poi_ = __.require('controllers', 'poi/lib/poi')
const error_ = __.require('lib', 'error')

module.exports = {
  get: function (req, res) {
    poi_.byId(req.params.id)
    .then(function (res) {
      res = res || []
      res.json({poi: res})
    })
    .catch(error_.Handler(res))
  },
  post: function (req, res) {
    poi_.create(req.body)
    .then(res.json.bind(res))
    .catch(error_.Handler(res))
  }
}
