const CONFIG = require('config')
const __ = CONFIG.universalPath
const should = require('should')

Poi = __.require('models', 'poi')

describe('poi model', function () {
  describe('create', function () {
    it('should be a function', function (done) {
      Poi.create.should.be.a.Function()
      done()
    })
    it('should return an object if the doc is valid', function (done) {
      var doc = {
        name: 'Jon'
      }
      var create = function () { return Poi.create(doc) }
      create.should.not.throw()
      create().should.be.an.Object()
      done()
    })
    it('should throw if the doc has no name', function (done) {
      var doc = {}
      var create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the name is empty', function (done) {
      var doc = {
        name: ''
      }
      var create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
  })
})
