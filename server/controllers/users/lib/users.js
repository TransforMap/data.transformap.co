const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const error_ = __.require('lib', 'error')
const promises_ = __.require('lib', 'promises')
const db = __.require('lib', 'db/db')('users', 'users')
const userUrl = CONFIG.server.url() + '/user'

module.exports = {
  validateData: function (data) {
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
  },
  findOrCreateUser: function(userInfo, done){
    this.findOneByUsername(userInfo.name)
    .then(function (res) {
      if(res !== [])
      _.Log(`${res} filter all ${userInfo}`)
      _.success(user = res, 'user found')
        return promises_.resolve(user)

    }, function(res) {
      _.Log('user not found', res)
        db.create(userUrl, userInfo)
        .then(function (res) {
          _.success(user = res.body, 'create user')
        })
        done(null, user)
    })
  },
  findOneByUsername: function (username) {
    const isValidUsername = (user) => username === user.name
    const user = _.find(db, isValidUsername)
    if (user) {
      _.success(username, 'valid user')
      return promises_.resolve(user)
    } else {
      _.error(username, 'user not found')
      // not returning an Error object as it triggers a 500 response
      return promises_.reject()
    }
  }
}
