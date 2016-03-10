const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const initDatabases = __.require('db', 'init')
const americano = require('americano')
const bluebird = require('bluebird')
const start = bluebird.promisify(americano.start)

initDatabases()
.then(() => start(CONFIG.server))
.then((app) => _.success('server started!!!'))
.catch(_.Error('init err'))
