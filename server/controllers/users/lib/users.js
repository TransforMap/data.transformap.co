const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const promises_ = __.require('lib', 'promises')

module.exports = {
  validateData: function (data) {
  },
  findOrCreateUser: function(userInfo, done){
    // mock user api (see branch 416-user-api)
    return {
      "_id": "uuids56s432",
      "type": "User",
      "contact": {
        "name": "Lumumba",
        "email": "unchained@mastodon.org"
      },
      "auth": {
        "provider": "http://lab.allmende.io"
      }
    }
  }
}
