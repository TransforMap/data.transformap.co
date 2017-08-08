const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
require('should')

const Place = __.require('controllers', 'things/models/types/place')

describe('place model', function () {
  describe('validateData', function () {
    it('should be a function', function (done) {
      Place.validateData.should.be.a.Function()
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
      const validateData = function () { return Place.validateData(data) }
      validateData.should.not.throw()
      done()
    })
    it('should throw if the geojson is not correct', function (done) {
      var data = _.cloneDeep(correctData)
      data.geometry.coordinates = null
      const validateData = function () { Place.validateData(data) }
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
      const validateData = function () { Place.validateData(data) }
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
      const validateData = function () { Place.validateData(data) }
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
      const validateData = function () { Place.validateData(data) }
      validateData.should.throw()
      done()
    })
    it('should throw if the name is empty', function (done) {
      var data = _.cloneDeep(correctData)
      data.properties.name = ''
      const validateData = function () { Place.validateData(data) }
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
})
