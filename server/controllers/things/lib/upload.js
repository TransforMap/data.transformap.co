const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const ipfsAPI = require('ipfs-api')
const db = __.require('lib', 'db/db')('things', 'versions')
const Version = require('../models/commons/version')

var ipfs = ipfsAPI(CONFIG.blobStore.multiaddr)

module.exports = function (file) {



  return
}
