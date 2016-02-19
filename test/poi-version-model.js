const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
require('should')

const it = global.it // for lint
const describe = global.describe // for lint

const PoiVersion = __.require('models', 'poi_version')
const someJournalId = 'caa653ce22d3213f54338dd45300041c'

describe('poi version model', function () {
  describe('validateData', function () {
    it('should be a function', function (done) {
      PoiVersion.create.should.be.a.Function()
      done()
    })

    const correctData = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [
          15.144269,
          47.050959
        ]
      },
      properties: {
        name: 'Django'
      }
    }

    it('should return an object if the data is valid', function (done) {
      const data = _.cloneDeep(correctData)
      const validateData = function () { return PoiVersion.validateData(data) }
      validateData.should.not.throw()
      validateData().should.be.an.Object()
      done()
    })
    it('should throw if the geojson is not correct', function (done) {
      var data = _.cloneDeep(correctData)
      data.geometry.coordinates = null
      const validateData = function () { PoiVersion.validateData(data) }
      validateData.should.throw()
      try {
        validateData()
      } catch (err) {
        console.log(err)
        err.message.should.equal('invalid GeoJSON type supplied')
      }
      done()
    })
    it('should throw if latitude is out of bounds', function (done) {
      var data = _.cloneDeep(correctData)
      data.geometry.coordinates[0] = -200
      const validateData = function () { PoiVersion.validateData(data) }
      validateData.should.throw()
      try {
        validateData()
      } catch (err) {
        console.log(err)
        err.message.should.equal('coordinate lat out of range')
      }
      done()
    })
    it('should throw if longitude is out of bounds', function (done) {
      var data = _.cloneDeep(correctData)
      data.geometry.coordinates[1] = 2000
      const validateData = function () { PoiVersion.validateData(data) }
      validateData.should.throw()
      try {
        validateData()
      } catch (err) {
        console.log(err)
        err.message.should.equal('coordinate lon out of range')
      }
      done()
    })
    it('should throw if the data has no name', function (done) {
      var data = _.cloneDeep(correctData)
      data.properties = {}
      const validateData = function () { PoiVersion.validateData(data) }
      validateData.should.throw()
      done()
    })
    it('should throw if the name is empty', function (done) {
      var data = _.cloneDeep(correctData)
      data.properties.name = ''
      const validateData = function () { PoiVersion.validateData(data) }
      validateData.should.throw()
      try {
        validateData()
      } catch (err) {
        console.log(err)
        err.message.should.equal('missing name')
      }
      done()
    })
  })
  describe('create', function () {
    it('should be a function', function (done) {
      PoiVersion.create.should.be.a.Function()
      done()
    })

    const correctDoc = {
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

    it('should throw if the journal id is missing', function (done) {
      var doc = _.cloneDeep(correctDoc)
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
