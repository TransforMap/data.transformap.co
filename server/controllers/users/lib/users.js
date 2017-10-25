const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const promises_ = __.require('lib', 'promises')
const db = __.require('lib', 'db/db')('users', 'users')

create = function (userData) {
  if (!Object.keys(userData).includes('contact')) {
    return promises_.reject('invalid data structure')
  }
  return db.post(userData)
  .then(_.Log('user post res'))
  .catch(_.ErrorRethrow('thing update err'))
}
byUsername = function (username) {
  return db.viewByKey("byUsername", username)
  .then(_.Log("User by Id"))
  .catch(_.ErrorRethrow('byId err'))
}
byId = function (id) {
  return db.viewByKey('byId', id)
  .then(_.Log("User by Id"))
  .catch(_.ErrorRethrow('byId err'))
}

module.exports = {
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
    })
  }
}
