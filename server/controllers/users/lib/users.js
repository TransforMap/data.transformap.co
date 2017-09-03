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
    const wannabeUser = {
      journal: 'bcf4f3ff325d7c8c7a5f67320e01a3f0',
      data: {
         name: 'moleculor',
         email: 'vincent.jumeaux@riseup.net',
         provider: 'https://lab.allmende.io/u/moleculor'
       }
    }
    done(null, wannabeUser)
  }
}
