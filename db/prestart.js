const C = require('config')
const __ = C.universalPath
const _ = __.require('lib', 'utils')
const breq = require('bluereq')
const uuid = require('uuid')

const wrap = function (el) {
  return [ "\x27", "\x22", el, "\x22", "\x27" ].join("")
}

const provide_password = function (el) {
  if (el.length === 0) {
    _.log(el, 'No Admin password set. Generating.')
    return uuid.v4()
  } else {
    return el
  }
}

const username = C.get('store.username')
const password = provide_password(C.get('store.password'))

var c = {
  prefix: [ C.get('store.scheme'), "://"].join(""),
  location: [ C.get('store.host'),":", C.get('store.port')].join(""),
  credentials: [ username, ":", password].join("")
}

const adm_path = "/_config/admins/"
const base_url = [ c.prefix, c.location].join("")
const full_url = [ c.prefix, c.credentials, "@", c.location].join("")
const test_url = [ base_url, adm_path].join("")
const user_url = [ base_url, adm_path, username].join("")

breq.get(test_url)
.then(function(res){
  if (Object.keys(res.body).length === 0) {
    breq.put({url: user_url, body: password})
      .then(function(res){
        _.log(["COUCHDB_URL=", full_url].join(""), 'Admin user created.')
      })
      .catch(function(res){
        _.log(err, 'Admin setup failed.')
      })
  } else {
    _.log(C.store, "Admins exist.")
  }
})
.catch(function(err){
  _.log(err, 'No connection to CouchDB possible.');
});
