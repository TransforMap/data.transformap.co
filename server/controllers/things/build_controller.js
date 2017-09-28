const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const buildLib = require('./build_lib')

module.exports = function (typeName) {
  const model = require(`./models/types/${typeName}`)
  const lib = buildLib(typeName, model)

  return {
    get: function (req, res) {
      const id = req.params.id

      if (!_.isUuid(id)) {
        var query = (id == 'all') ? '' : id
        lib.filter(query)
        .then(_.Log('get with !uuid'))
        .then(res.json.bind(res))
        .catch(error_.Handler(res))
      } else {
        lib.currentVersionById(id)
        .then(res.json.bind(res))
        .catch(error_.Handler(res))
      }
    },
    post: function (req, res) {
      if (req.files) {
        lib.upload(req.body, req.files.mediaUpload) // code smell: hard coded input id, configurable, or per type?
        .then(res.json.bind(res))
        .catch(error_.Handler(res))
      } else {
        lib.create(req.body)
        .then(res.json.bind(res))
        .catch(error_.Handler(res))
      }


    },
    put: function (req, res) {

      const id = req.params.id

      if (!_.isUuid(id)) {
        error_.bundle(res, 'invalid id', 400, id)
        return
      }

      lib.update(req.body, id)
      .then(res.json.bind(res))
      .catch(error_.Handler(res))

    },
    delete: function (req, res) {

      const id = req.params.id

      if (!_.isUuid(id)) {
        error_.bundle(res, 'invalid id', 400, id)
        return
      }

      lib.delete(id)
      .then(res.json.bind(res))
      .catch(error_.Handler(res))

    }
  }
}
