const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')

const libraryBuilder = require('./build_lib')

module.exports = function () {
  const lib = libraryBuilder()

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
      const count = parseInt(req.params.count)
      if(isNaN(count)) {
        error_.bundle(res, 'invalid count', 400, count)
        return
      }

      lib.latest(count)
      .then(res.json.bind(res))
      .then(error_.Handler(res))
    },
    latestSince: function (req, res) {
      const pointInTime = parseInt(req.params.pointInTime)

      if(isNaN(pointInTime)) {
        error_.bundle(res, 'invalid point in time', 400, pointInTime)
        return;
      }

      lib.latestSince(pointInTime)
      .then(res.json.bind(res))
      .then(error_.Handler(res))
    }
  }
}
