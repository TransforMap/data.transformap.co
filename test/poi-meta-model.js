const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
require('should')

const it = global.it // for lint
const describe = global.describe // for lint

const PoiMeta = __.require('models', 'poi_meta')
const someMetaId = 'caa653ce22d3213f54338dd45300041c'

const validVersionDoc = function (metaId) {
  return {
    _id: 'abf653ce22d3213f54338dd45300041c',
    type: "poi",
    geometry: {
      "type": "Point",
      "coordinates": [
        15.144269,
        47.050959
      ]
    },
    properties: {
      name: 'Transition House',
    },
    meta: metaId
  }
}

describe('poi meta model', function () {
  describe('create', function () {
    it('should be a function', function (done) {
      PoiMeta.create.should.be.a.Function()
      done()
    })
    it('should return an object', function (done) {
      PoiMeta.create.should.not.throw()
      PoiMeta.create().should.be.an.Object()
      done()
    })
    it('should have type set to meta', function (done) {
      PoiMeta.create().type.should.equal('meta')
      done()
    })
    it('should return an object with an array of refs', function (done) {
      PoiMeta.create().refs.should.be.an.Array()
      done()
    })
  })

  describe('update', function () {
    it('should be a function', function (done) {
      PoiMeta.update.should.be.a.Function()
      done()
    })
    it('should return an object', function (done) {
      const metaDoc = {
        _id: someMetaId,
        refs: []
      }
      const versionDoc = validVersionDoc(someMetaId)
      PoiMeta.update(metaDoc, versionDoc).should.not.throw()
      PoiMeta.update(metaDoc, versionDoc).should.be.an.Object()
      done()
    })
    it('should return an object with one more ref', function (done) {
      const metaDoc = {
        _id: someMetaId,
        refs: []
      }
      const versionDoc = validVersionDoc(someMetaId)
      const updatedMetaDoc = PoiMeta.update(metaDoc, versionDoc)
      updatedMetaDoc.refs.length.should.equal(1)
      done()
    })
    it('should return an object with refs ids only', function (done) {
      const metaDoc = {
        _id: someMetaId,
        refs: []
      }
      const versionDoc = validVersionDoc(someMetaId)
      const updatedMetaDoc = PoiMeta.update(metaDoc, versionDoc)
      _.isUuid(updatedMetaDoc.refs[0]).should.equal(true)
      done()
    })
    it('should return an object with current set to the versionDoc', function (done) {
      const metaDoc = {
        _id: someMetaId,
        refs: []
      }
      const versionDoc = validVersionDoc(someMetaId)
      const updatedMetaDoc = PoiMeta.update(metaDoc, versionDoc)
      updatedMetaDoc.current.should.equal(versionDoc)
      done()
    })
  })
})
