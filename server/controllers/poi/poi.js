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
      if (err.statusCode === 404) {
        res.status(404).json({status: 'not_found'})
      } else {
        _.error(err, 'poi get err')
        res.status(500).json({status: 'internal_error'})
      }
    })
  }
}
