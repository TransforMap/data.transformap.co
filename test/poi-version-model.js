const CONFIG = require('config')
const __ = CONFIG.universalPath
require('should')

const it = global.it // for lint
const describe = global.describe // for lint

const PoiVersion = __.require('models', 'poi_version')
const someMetaId = 'caa653ce22d3213f54338dd45300041c'

describe('poi version model', function () {
  describe('create', function () {
    it('should be a function', function (done) {
      PoiVersion.create.should.be.a.Function()
      done()
    })
    it('should return an object if the doc is valid', function (done) {
      const doc = {
        name: 'Jon',
        lat: 1,
        lon: 1,
        meta: someMetaId
      }
      const create = function () { return PoiVersion.create(doc) }
      create.should.not.throw()
      create().should.be.an.Object()
      done()
    })
    it('should throw if the coordinates are not provided', function (done) {
      const doc = { name: 'K', lat: null, lon: null, meta: someMetaId }
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the coordinates are of type number', function (done) {
      const doc = { name: 'K', lat: '1', lon: '1' , meta: someMetaId}
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the coordinates are out of bounds', function (done) {
      const doc = { name: 'K', lat: -200, lon: 2000 , meta: someMetaId}
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the doc has no name', function (done) {
      const doc = { lat: '1', lon: '1' , meta: someMetaId}
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the name is empty', function (done) {
      const doc = { name: '', lat: '1', lon: '1' , meta: someMetaId}
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if status is set, with is only used for deleted/obsolete objects', function (done) {
      const doc = {lat: '1', lon: '1', name: 'K', status: 'deleted', meta: someMetaId}
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the meta id is missing', function (done) {
      const doc = { lat: 1, lon: 1, name: 'K'}
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
  })
})
