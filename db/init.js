const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const dbsList = require('./dbs_list')
const nano = __.require('lib', 'db/nano')
const promises_ = __.require('lib', 'promises')
const fs = __.require('lib', 'fs')
// const buildDbApi = __.require('lib', 'db/build_db_api')

module.exports = function () {
  // init all dbs
  return promises_.all(dbsList.map(initDb))
    .catch(_.ErrorRethrow('db init err'))
}

const initDb = function (dbData) {
  _.log(dbData, 'initDb')
  const name = dbData.name
  const designDocs = dbData.designDocs
  // const db = buildDbApi(nano.use(name))
  const db = nano.use(name)
  return ensureDbExistance(name, db)
    .then(syncDesignDocs.bind(null, db, designDocs))
}

const ensureDbExistance = function (dbName, db) {
  return db.info()
    .then((res) => _.success(`${dbName} database: exist`))
    .catch(Create(dbName))
    .catch(_.ErrorRethrow('ensureDbExistance'))
}

const Create = function (dbName) {
  return function (err) {
    if (err.statusCode === 404) {
      return nano.db.create(dbName)
        .then(_.Log(`${dbName} database: created`))
    } else {
      throw err
    }
  }
}

// this verifies that the database design documents are up-to-date
// with the design docs files
const syncDesignDocs = function (db, designDocs) {
  return promises_.all(designDocs.map(syncDesignDoc.bind(null, db)))
}

const syncDesignDoc = function (db, designDocName) {
  const designDocId = `_design/${designDocName}`
  return getDesignDocFile(designDocName)
    .then(function (designDocFile) {
      return getCurrentDesignDoc(db, designDocId)
        .then(updateDesignDoc.bind(null, db, designDocId, designDocFile))
    })
}

const getDesignDocFile = function (designDocName) {
  const designDocPath = __.path('designDocs', `${designDocName}.json`)
  return fs.readFile(designDocPath)
    .catch(function (err) {
      if (err.code === 'ENOENT') {
        // initialize the design doc if none is found
        // return a stringify version to keep consistency
        // with what would the normal readFile
        initDoc = JSON.stringify(emtpyDesignDoc(designDocName), null, 4)
        // creating the design doc file but not waiting for its creation
        fs.writeFile(designDocPath, initDoc)
        .then(function () {
          _.log(designDocPath, 'design doc file created')
        })

        return initDoc
      } else {
        _.error(err, 'reloadDesignDoc readFile err')
        throw err
      }
    })
}

const getCurrentDesignDoc = function (db, designDocId) {
  return db.get(designDocId)
    .spread(function (body, header) {
      return body
    })
    .catch(function (err) {
      if (err.statusCode === 404) {
        _.info(designDocId, 'design doc not found: creating')
        // pass an empty document to trigger a document update
        return {}
      } else {
        throw err
      }
    })
}

const updateDesignDoc = function (db, designDocId, designDocFile, currentDesignDoc) {
  const rev = currentDesignDoc && currentDesignDoc._rev
  // delete the rev to be able to compare object
  delete currentDesignDoc._rev
  // designDocFile should be a stringified object
  currentDesignDocStr = JSON.stringify(currentDesignDoc)
  // comparison is made without spaces to avoid false negative
  if (removeSpaces(designDocFile) === removeSpaces(currentDesignDocStr)) {
    _.info(designDocId, 'design doc up-to-date')
  } else {
    _.info(designDocId, 'updating design doc')
    const update = JSON.parse(designDocFile)
    update._rev = rev
    return db.insert(update)
      .spread(function (body) {
        _.success(designDocId, 'design doc updated')
      })
      .catch(function (err) {
        _.error(err.request, err.message)
      })
  }
}

const emtpyDesignDoc = function (designDocName) {
  return {
    _id: `_design/${designDocName}`,
    language: "javascript"
  }
}

const removeSpaces = function (string) {
  return string.replace(/\s/g, '')
}
