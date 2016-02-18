const root = process.cwd() + '/'

const paths = {
  root: 'src',
  controllers: 'daemon/controllers',
  lib: 'daemon/lib',
  models: 'daemon/models',
  store: 'store',
  designDocs: 'store/design_docs'
}

const path = function (folder, name) {
  const rootedPath = root + paths[folder]
  if (name) {
    return `${rootedPath}/${name}`
  } else {
    return rootedPath
  }
}

const req = function (folder, name) {
  return require(path(folder, name))
}

module.exports = {
  paths: paths,
  path: path,
  require: req
}
