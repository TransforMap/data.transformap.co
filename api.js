const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const initDatabases = __.require('db', 'init')
const start = require('./server/start')

initDatabases()
.then(start)
.then((app) => _.success('server started!!!'))
.catch(_.Error('init err'))
