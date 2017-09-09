const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const promises_ = __.require('lib', 'promises')
const error_ = __.require('lib', 'error')
const db = __.require('lib', 'db/db')('users', 'users')
const User = __.require('controllers', 'users/lib/users')

module.exports = {
  byId: function (id) {
    return db.viewByKey('byId', id)
    .then(_.Log("User by Id"))
    .catch(_.ErrorRethrow('user creation err'))
  },
  create: function (userData) {
    if (!Object.keys(userData).includes('contact')) {
      return promises_.reject('invalid data structure')
    }
    try {
      User.validateData(userData)
    } catch (err) {
      return promises_.reject(err)
    }
    return db.post(userData)
    .then(_.Log('user post res'))
    .catch(_.ErrorRethrow('thing update err'))
  },
}
