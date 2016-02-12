const CONFIG = require('config')
const __ = CONFIG.universalPath
require('should')

const it = global.it // for lint
const describe = global.describe // for lint

const Poi = __.require('models', 'poi')

describe('poi model', function () {
  describe('create', function () {
    it('should be a function', function (done) {
      Poi.create.should.be.a.Function()
      done()
    })
    it('should return an object if the doc is valid', function (done) {
      const doc = {
        name: 'Jon',
        type: 'poi',
        lat: 1,
        lon: 1
      }
      const create = function () { return Poi.create(doc) }
      create.should.not.throw()
      create().should.be.an.Object()
      done()
    })
    it('should throw if not of type poi', function (done) {
      const doc = { name: 'K', lat: 1, lon: 1 }
      const create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the coordinates are not provided', function (done) {
      const doc = { name: 'K', lat: null, lon: null, type: 'poi' }
      const create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the coordinates are of type number', function (done) {
      const doc = { name: 'K', lat: '1', lon: '1', type: 'poi' }
      const create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the coordinates are out of bounds', function (done) {
      const doc = { name: 'K', lat: -200, lon: 2000, type: 'poi' }
      const create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the doc has no name', function (done) {
      const doc = { lat: '1', lon: '1', type: 'poi' }
      const create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the name is empty', function (done) {
      const doc = { name: '', lat: '1', lon: '1', type: 'poi' }
      const create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if status is set, with is only used for deleted/obsolete objects', function (done) {
      const doc = {lat: '1', lon: '1', type: 'poi', name: 'K', status: 'deleted'}
      const create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
  })
})
