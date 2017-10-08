const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const User = require('./lib/users')
const error_ = __.require('lib', 'error')
const _passport = require('./../../middlewares/passport')

module.exports = {
  generateRoutes: function () {
    return {
      "user": {
        get: [
          _passport.ensureAuthenticated,
          function (req, res) {
            const whoAmI = req.session.passport.user
            User.byId(whoAmI)
            .then(res.json.bind(res))
            .catch(error_.Handler(res))
          }
        ]
      }
    }
  }
}