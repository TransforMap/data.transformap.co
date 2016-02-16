const nano = require('./nano')
const buildDbApi = require('./build_db_api')

module.exports = function (dbName, designName) {
  const db = nano.use(dbName)
  // generate an API tailored to our needs
  // rather than the raw nano API
  return buildDbApi(db, designName)
}
