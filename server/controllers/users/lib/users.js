const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const promises_ = __.require('lib', 'promises')

module.exports = {
  validateData: validateData,
  create: create,
  byUsername: byUsername,
  byId: byId,
  findOrCreateUser: function(userInfo){
    return byUsername(userInfo.contact.name)
    .then(function (foundUser) {
      if(foundUser){
        return foundUser
      } else {
        return create(userInfo)
      }
    }
  }
}
