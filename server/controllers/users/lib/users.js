const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const records = [
  { id: 1, gitlab_name: 'michael' },
  { id: 2, gitlab_name: 'jon' },
  { id: 3, gitlab_name: 'gualter' }
]
const promises_ = __.require('lib', 'promises')

module.exports = {
  findOneByUsername: function (username) {
    const validUsername = (user) => user.username === username
    const user = _.find(records, validUsername)
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
