const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const it = global.it // for lint
const describe = global.describe // for lint
require('should')

const breq = require('bluereq')
const get = (url) => breq.get(url).then(_.property('body'))
const post = (url, body) => breq.post(url, body).then(_.property('body'))
const placeEndpoint = CONFIG.server.url() + '/place'
const versionsEndpoint = CONFIG.server.url() + '/versions'
const placeNewDoc = require('../fixtures/place-new-to-create-for-api')

const withCreatedVersion = function (template, lambda) {
  post(placeEndpoint, placeNewDoc)
  .then(function (body) {
    get(`${placeEndpoint}/${body.id}`)
    .then(function (doc) {
      get(`${versionsEndpoint}/${doc._versionId}`)
      .then(function (version) {
        lambda(doc, version)
      })
    })
  })
}

const withTwoVersions = function (lambda) {
  post(placeEndpoint, placeNewDoc)
  .then(function () {
    post(placeEndpoint, placeNewDoc)
    .then(function () {
      lambda()
    })
  })
}

describe('/versions', function () {
  describe('GET', function () {
    it('should return a feature collection', function (done) {
      this.timeout(6000) // The request can become quite big
      get(versionsEndpoint)
      .then(function (result) {
        result.type.should.equal('FeatureCollection')
        done()
      })
    })
    it('should list versions newest to oldest', function (done) {
      this.timeout(6000)// The request can become quite big
      post(placeEndpoint, placeNewDoc)
      .then(function () {
        post(placeEndpoint, placeNewDoc)
        .then(function () {
          get(versionsEndpoint)
          .then(function (result) {
            for (var i = 1; i < result.features.length; i++) {
              result.features[i].properties._timestamp.should.be.belowOrEqual(result.features[i - 1].properties._timestamp)
            }
            done()
          })
        })
      })
    })
  })
})

describe('/versions/latest/:limit', function () {
  it('should return a feature collection', function (done) {
    get(`${versionsEndpoint}/latest/5`)
    .then(function (result) {
      result.type.should.equal('FeatureCollection')
      done()
    })
  })
  it('should list versions newest to oldest', function (done) {
    withTwoVersions(function () {
      get(`${versionsEndpoint}/latest/1`)
      .then(function (result) {
        result.features.length.should.be.belowOrEqual(5)
        done()
      })
    })
  })
})

describe('/versions/:id', function () {
  describe('GET', function () {
    it('should be able to get a version', function (done) {
      withCreatedVersion(placeNewDoc, function (thingObject, versionObject) {
        thingObject._versionId.should.equal(versionObject._versionId)
        done()
      })
    })

    it('should return 400 with invalid id', function (done) {
      breq.get(`${versionsEndpoint}/someInvalidId`)
      .then(function (res) {
        res.statusCode.should.equal(400)
        done()
      })
    })
    it('should return 404 for unknown id', function (done) {
      breq.get(`${versionsEndpoint}/76100b453de20da6744eac86700294b8`)
      .then(function (res) {
        res.statusCode.should.equal(404)
        done()
      })
    })
  })
})

describe('/versions/since/:pointInTime', function () {
  describe('GET', function () {
    it('should return 400 with invalid point in time', function (done) {
      breq.get(`${versionsEndpoint}/since/invalidPointInTime`)
      .then(function (res) {
        res.statusCode.should.equal(400)
        done()
      })
    })
    it('should return a feature collection', function (done) {
      const pointInTime = (+new Date())
      withTwoVersions(function () {
        get(`${versionsEndpoint}/since/${pointInTime}`)
        .then(function (result) {
          result.type.should.equal('FeatureCollection')
          done()
        })
      })
    })
    it('should return only versions with timestamp > pointInTime', function (done) {
      const pointInTime = (+new Date())
      withTwoVersions(function () {
        get(`${versionsEndpoint}/since/${pointInTime}`)
        .then(function (result) {
          result.features.forEach((feature) => {
            feature.properties._timestamp.should.be.aboveOrEqual(pointInTime)
          })
          done()
        })
      })
    })
  })
})
