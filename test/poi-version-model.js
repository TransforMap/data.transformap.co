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
        meta: someMetaId,
        geojson : {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              15.144269,
              47.050959
            ]
          }
        },
        properties: {
          name: 'Jon'
        }
      }
      const create = function () { return PoiVersion.create(doc) }
      create.should.not.throw()
      create().should.be.an.Object()
      done()
    })
    it('should throw if the geojson is not correct', function (done) {
      const doc = {
        meta: someMetaId,
        geojson : {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
            ]
          }
        },
        properties: {
          name: 'Jon'
        }
      }
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the coordinates are out of bounds', function (done) {
      const doc = {
        meta: someMetaId,
        geojson : {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              -200,
              2000
            ]
          }
        },
        properties: {
          name: 'Jon'
        }
      }
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the doc has no name', function (done) {
      const doc = {
        meta: someMetaId,
        geojson : {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              15.144269,
              47.050959
            ]
          }
        },
        properties: {
        }
      }
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the name is empty', function (done) {
      const doc = {
        meta: someMetaId,
        geojson : {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              15.144269,
              47.050959
            ]
          }
        },
        properties: {
          name: ''
        }
      }
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the meta id is missing', function (done) {
      const doc = {
        geojson : {
          type: "Feature",
          geometry: {
            type: "Point",
            coordinates: [
              15.144269,
              47.050959
            ]
          }
        },
        properties: {
          name: 'T'
        }
      }
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
  })
})
