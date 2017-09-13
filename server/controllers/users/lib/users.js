const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const promises_ = __.require('lib', 'promises')
const userUrl = CONFIG.server.url() + '/user'
const db = __.require('lib', 'db/db')('users', 'users')

create = function (userData) {
  if (!Object.keys(userData).includes('contact')) {
    return promises_.reject('invalid data structure')
  }
  try {
    validateData(userData)
  } catch (err) {
    return promises_.reject(err)
  }
  return db.post(userData)
  .then(_.Log('user post res'))
  .catch(_.ErrorRethrow('thing update err'))
}

validateData = function (data) {
  if (!Object.keys(data).includes('contact')) {
    throw error_.new('invalid data structure', 400, data)
  }
  if (data.contact.name.length == 0) {
    throw error_.new('missing name', 400, data)
  }
  // derived from http://www.regular-expressions.info/email.html
  const email_match = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$")
  if (email_match.test(data.contact.email) == false) {
    throw error_.new('invalid email type supplied', 400, data)
  }
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
  validateData: validateData,
  create: create,
  byUsername: byUsername,
  byId: byId,
  findOrCreateUser: function(userInfo, done){
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
