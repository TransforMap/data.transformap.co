const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
require('should')

const it = global.it // for lint
const describe = global.describe // for lint

const PoiVersion = __.require('models', 'poi_version')
const someJournalId = 'caa653ce22d3213f54338dd45300041c'

describe('poi version model', function () {
  describe('create', function () {
    it('should be a function', function (done) {
      PoiVersion.create.should.be.a.Function()
      done()
    })

    const correct_doc = {
      journal: someJournalId,
      data: {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [
            15.144269,
            47.050959
          ]
        },
        properties: {
          name: 'Jon'
        }
      }
    }

    it('should return an object if the doc is valid', function (done) {
      const doc = correct_doc
      const create = function () { return PoiVersion.create(doc) }
      create.should.not.throw()
      create().should.be.an.Object()
      done()
    })
    it('should throw if the geojson is not correct', function (done) {
      var doc = _.cloneDeep(correct_doc)
      doc.data.geometry.coordinates = null
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      try {
        create()
      } catch (err) {
        console.log(err)
        err.message.should.equal('invalid GeoJSON type supplied')
      }
      done()
    })
    it('should throw if latitude is out of bounds', function (done) {
      var doc = _.cloneDeep(correct_doc)
      doc.data.geometry.coordinates[0] = -200
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      try {
        create()
      } catch (err) {
        console.log(err)
        err.message.should.equal('coordinate lat out of range')
      }
      done()
    })
    it('should throw if longitude is out of bounds', function (done) {
      var doc = _.cloneDeep(correct_doc)
      doc.data.geometry.coordinates[1] = 2000
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      try {
        create()
      } catch (err) {
        console.log(err)
        err.message.should.equal('coordinate lon out of range')
      }
      done()
    })
    it('should throw if the doc has no name', function (done) {
      var doc = _.cloneDeep(correct_doc)
      doc.data.properties = {}
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the name is empty', function (done) {
      var doc = _.cloneDeep(correct_doc)
      doc.data.properties.name = ''
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      try {
        create()
      } catch (err) {
        console.log(err)
        err.message.should.equal('missing name')
      }
      done()
    })
    it('should throw if the journal id is missing', function (done) {
      var doc = _.cloneDeep(correct_doc)
      doc.journal = {}
      const create = function () { PoiVersion.create(doc) }
      create.should.throw()
      try {
        create()
      } catch (err) {
        console.log(err)
        err.message.should.equal('missing journal id')
      }
      done()
    })
  })
})
