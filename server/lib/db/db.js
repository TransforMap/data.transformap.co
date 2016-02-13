const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const dbC = CONFIG.db
const fullUrl = `${dbC.protocol}://${dbC.username}:${dbC.password}@${dbC.host}:${dbC.port}`
const nano = require('nano-blue')(fullUrl)
const buildDbApi = require('./build_db_api')

module.exports = function (dbName) {
  const db = nano.use(dbName)
  // /!\ we are not returning the ensureDbExistance promise
  // so the database creation might happen after we return
  ensureDbExistance(dbName, db)
  // generate an API tailored to our needs
  // rather than the raw nano API
  return buildDbApi(db)
}

const ensureDbExistance = function (dbName, db) {
  db.info()
  .then((res) => _.success(`${dbName} database: exist`))
  .catch(Create(dbName))
  .catch(_.Error('ensureDbExistance'))
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
