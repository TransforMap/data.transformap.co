const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const User = require('./lib/users')
const error_ = __.require('lib', 'error')

module.exports = {
  generateRoutes: function () {
    return {
      "users": {
        // TODO implement ensureAuthenticated from branch 425 oauth
        post: function (req, res) {
          User.create(req.body)
          .then(res.json.bind(res))
          .catch(function (err) {
            error_.bundle(res, err, 400, req.body)
          })
        }
      },
      "users/:id": {
        get: function (req, res) {
          const id = req.params.id
          User.byId(id)
          .then(res.json.bind(res))
          .catch(error_.Handler(res))
        }
      }
    }
  }
}