const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

const lib_ = require('./versions_lib')

module.exports = function () {
  const lib = lib_()

  return {
    get: function (req, res) {
      const id = req.params.id

      if(!_.isUuid(id)) {
        error_.bundle(res, 'invalid id', 400, id)
        return
      }

      lib.byId(id)
      .then(res.json.bind(res))
      .catch(error_.Handler(res))
    },
    all: function (req, res) {
      lib.all()
      .then(res.json.bind(res))
      .catch(error_.Handler(res))
    },
    latest: function (req, res) {
      const count = req.params.count
      lib.latest(count)
      .then(res.json.bind(res))
      .then(error_.Handler(res))
    }
  }
}
