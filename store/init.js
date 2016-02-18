const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
const storeList = require('./store_list')
const nano = __.require('lib', 'store/nano')
const promises_ = __.require('lib', 'promises')
const fs = __.require('lib', 'fs')
// const buildStoreApi = __.require('lib', 'store/build_store_api')

module.exports = function () {
  // init all storess
  return promises_.all(storeList.map(initStore))
    .catch(_.ErrorRethrow('store init err'))
}

const initStore = function (storeData) {
  _.log(storeData, 'initStore')
  const name = storeData.name
  const designDocs = storeData.designDocs
  // const store = buildStoreApi(nano.use(name))
  const store = nano.use(name)
  return ensureStoreExistance(name, store)
    .then(syncDesignDocs.bind(null, store, designDocs))
}

const ensureStoreExistance = function (storeName, store) {
  return store.info()
    .then((res) => _.success(`${storeName} database: exist`))
    .catch(Create(storeName))
    .catch(_.ErrorRethrow('ensureStoreExistance'))
}

const Create = function (storeName) {
  return function (err) {
    if (err.statusCode === 404) {
      return nano.store.create(storeName)
        .then(_.Log(`${storeName} database: created`))
    } else {
      throw err
    }
  }
}

// this verifies that the database design documents are up-to-date
// with the design docs files
const syncDesignDocs = function (store, designDocs) {
  return promises_.all(designDocs.map(syncDesignDoc.bind(null, store)))
}

const syncDesignDoc = function (store, designDocName) {
  const designDocId = `_design/${designDocName}`
  return getDesignDocFile(designDocName)
    .then(function (designDocFile) {
      return getCurrentDesignDoc(store, designDocId)
        .then(updateDesignDoc.bind(null, store, designDocId, designDocFile))
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

const getCurrentDesignDoc = function (store, designDocId) {
  return store.get(designDocId)
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

const updateDesignDoc = function (store, designDocId, designDocFile, currentDesignDoc) {
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
    return store.insert(update)
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
