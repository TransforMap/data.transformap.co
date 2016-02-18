const nano = require('./nano')
const buildStoreApi = require('./build_store_api')

module.exports = function (storeName, designName) {
  const store = nano.use(storeName)
  // generate an API tailored to our needs
  // rather than the raw nano API
  return buildStoreApi(store, designName)
}
