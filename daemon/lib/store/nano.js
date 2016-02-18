const storeConfig = require('config').store
module.exports = require('nano-blue')(storeConfig.url())
