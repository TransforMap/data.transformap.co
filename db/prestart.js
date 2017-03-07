const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const breq = require('bluereq')
const uuid = require('uuid')

const wrap = (el) => `"${el}"`

const providePassword = function (str) {
  if (str.length === 0) {
    console.log('No Admin password set. Generating.')
    return generatePassword()
  } else {
    return str
  }
}

const generatePassword = function () {
  var password = uuid.v4()
  return exportPassword(password)
}

const exportPassword = function (str) {
  if (str.length === 0) {
    return 'No Admin password given. Aborting.'
  } else {
    process.env['COUCHDB_PASS'] = str
    _.log(str, 'Admin password exported to process environment variable.')
    return str
  }
}

const username = CONFIG.get('store.username')
const password = providePassword(CONFIG.get('store.password'))
const scheme = CONFIG.get('store.scheme')
const host = CONFIG.get('store.host')
const port = CONFIG.get('store.port')

var urlConfig = {
  prefix: `${scheme}://`,
  location: `${host}:${port}`,
  credentials: `${username}:${password}`
}

const admPath = '/_config/admins/'
const baseUrl = `${urlConfig.prefix}${urlConfig.location}`
const fullUrl = `${urlConfig.prefix}${urlConfig.credentials}@${urlConfig.location}`
const testUrl = `${baseUrl}${admPath}`
const userUrl = `${baseUrl}${admPath}${username}`

breq.get(testUrl)
.then(function (res) {
  if (Object.keys(res.body).length !== 0) {
    _.log(CONFIG.store, 'Admins exist.')
    return
  }
  return breq.put({url: userUrl, body: wrap(password), headers: {'Content-Type': 'application/x-www-form-urlencoded'}})
  .then((res) => `COUCHDB_URL=${fullUrl}`)
  .then(_.Log('Admin user created.'))
  .catch(_.ErrorRethrow('Admin setup failed.'))
})
.catch(_.ErrorRethrow('No connection to CouchDB possible.'))
