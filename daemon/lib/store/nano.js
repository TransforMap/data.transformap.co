const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const storeConfig = require('config').get('store')
_.log(storeConfig, 'storeConfig')
_.log(storeConfig.url(), 'url')
module.exports = require('nano-blue')(storeConfig.url())
