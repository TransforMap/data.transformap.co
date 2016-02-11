const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const dbC = CONFIG.db
const fullUrl = `${dbC.protocol}://${dbC.username}:${dbC.password}@${dbC.host}:${dbC.port}`
const nano = require('nano-blue')(fullUrl)

module.exports = function (dbName) {
  const db = nano.use(dbName)

  return db.info()
    .then((res) => _.success(`${dbName} database: exist`))
    .catch(Create(dbName))
    .then((res) => db)
    .catch(_.ErrorRethrow('db init'))
}

const Create = function (dbName) {
  return function (err) {
    if (err.statusCode === 404) {
      nano.db.create(dbName)
      .then(_.Log(`${dbName} database: created`))
    } else {
      throw err
    }
  }
}
