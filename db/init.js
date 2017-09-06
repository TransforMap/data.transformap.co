const CONFIG = require('config')
const __ = CONFIG.universalPath
const couchInit = require('couch-init2')
const dbUrl = CONFIG.get('store').url()
const designDocFolder = __.path('designDocs')
const dbsList = [
  {
    name: 'things',
    designDocs: ['journals', 'versions']
  },
  {
    name: 'users',
    designDocs: ['journals', 'versions']
  }
]

module.exports = function () {
  return couchInit(dbUrl, dbsList, designDocFolder)
}
