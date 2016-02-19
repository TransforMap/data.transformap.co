const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const breq = require('bluereq')
const dbUrl = CONFIG.store.url()

module.exports = function (db, dbName) {
  return db.get('_security')
  .spread(function (body, headers) {
    if (body.admins == null) {
      const url = `${dbUrl}/${dbName}/_security`
      _.info(dbName, 'adding security doc')
      return breq.put(url, securityDoc())
      .catch(_.ErrorRethrow('put security doc'))
    }
  })
}

const securityDoc = function () {
  const username = CONFIG.store.username
  if (!_.isNonEmptyString(username)) {
    throw new Error(`bad CONFIG.db.username: ${username}`)
  }
  return {
    // Database admins can update design documents
    // and edit the admin and member lists.
    admins: { names: [username] },
    // Database members can access the database.
    // If no members are defined, the database is public.
    // Thus we just copy the admin there too to limit database access
    members: { names: [username] }
  }
}
