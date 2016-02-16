const root = process.cwd() + '/'

const paths = {
  root: '',
  controllers: 'server/controllers',
  lib: 'server/lib',
  models: 'server/models',
  db: 'db',
  designDocs: 'db/design_docs'
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
