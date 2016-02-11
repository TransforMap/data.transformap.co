const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const db = __.require('lib', 'db')('poi')

module.exports = {
  get: function (req, res) {
    const id = req.params.id

    db.get(id)
    .then(_.Log('poi get'))
    .then(function (res) {
      res = res || []
      res.json({poi: res})
    })
    .catch(function (err) {
      _.error(err, 'poi get')
      res.status(404).json({status: 'not_found'})
    })
  }
}
