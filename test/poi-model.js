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
        name: 'Jon',
	type: 'poi',
	lat: 1,
	lon: 1
      }
      var create = function () { return Poi.create(doc) }
      create.should.not.throw()
      create().should.be.an.Object()
      done()
    })
    it('should throw if not of type poi', function (done) {
      var doc = { name: "K", lat: 1, lon: 1 }
      var create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the coordinates are not provided', function (done) {
      var doc = { name: "K", lat: null, lon: null, type: "poi" }
      var create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the coordinates are of type number', function (done) {
      var doc = { name: "K", lat: "1", lon: "1" , type: "poi"}
      var create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the coordinates are out of bounds', function (done) {
      var doc = { name: "K", lat: -200, lon: 2000 , type: "poi"}
      var create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the doc has no name', function (done) {
      var doc = {lat: "1", lon: "1" , type: "poi"}
      var create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
    it('should throw if the name is empty', function (done) {
      var doc = {
        name: '',
        lat: "1", lon: "1" , type: "poi"
      }
      var create = function () { Poi.create(doc) }
      create.should.throw()
      done()
    })
  })
})
