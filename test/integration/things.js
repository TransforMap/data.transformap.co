const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')

const it = global.it // for lint
const describe = global.describe // for lint
require('should')

const breq = require('bluereq')
const get = (url) => breq.get(url).then(_.property('body'))
const post = (url, body) => breq.post(url, body).then(_.property('body'))
const put = (url, body) => breq.put(url, body).then(_.property('body'))
const delete_ = (url) => breq.delete(url).then(_.property('body'))
const endpoint = CONFIG.server.url() + '/place'
const placeNewDoc = require('../fixtures/place-new-to-create-for-api')

const createJournalWithTwoVersions = function (doc, callback) {
  post(endpoint, doc)
  .then(function (createResponse) {
    get(`${endpoint}/${createResponse.id}`)
    .then(function (firstVersion) {
      doc.properties.name += ' - Version 2'
      put(`${endpoint}/${firstVersion._id}`, doc)
      .then(function (updateResponse) {
        get(`${endpoint}/${updateResponse.id}`)
        .then(function (secondVersion) {
          callback(createResponse.id, firstVersion, secondVersion)
        })
      })
    })
  })
}

describe('/place', function () {
  describe('POST doc', function () {
    it('should return the doc with journal id', function (done) {
      post(endpoint, placeNewDoc)
      .then(function (body) {
        body.ok.should.equal(true)
        _.isUuid(body.id).should.equal(true)
        done()
      })
    })
    it('should return a 400 on invalid doc', function (done) {
      const invalidNewDoc = {
        so: 'much',
        invalid: true
      }
      breq.post(endpoint, invalidNewDoc)
      .then(function (res) {
        res.statusCode.should.equal(400)
        done()
      })
    })
  })
  describe('GET id', function () {
    it('should return the same object via GET that is pushed previously via POST', function (done) {
      post(endpoint, placeNewDoc)
      .then(function (body1) {
        get(`${endpoint}/${body1.id}`)
        .then(function (body2) {
          body2.should.be.an.Object()
          body2.properties.should.be.an.Object()
          _.isUuid(body2._id).should.equal(true)
          body2._id.should.equal(body1.id)
          // copying the id to make comparison simpler
          placeNewDoc._id = body2._id
          // removing versionId to make comparison simpler
          delete body2._versionId
          const b = JSON.stringify(placeNewDoc)
          const a = JSON.stringify(body2)
          if (a !== b) {
            _.log('posted', a)
            _.log('returned', b)
          }
          a.should.equal(b)
          done()
        })
      })
    })
  })
  describe('GET id/versions', function () {
    it('should return a feature collection', function (done) {
      createJournalWithTwoVersions(placeNewDoc, function (journalId, firstVersion, secondVersion) {
        get(`${endpoint}/${journalId}/versions`)
        .then(function (versionsResponse) {
          versionsResponse.type.should.equal('FeatureCollection')
          done()
        })
      })
    })
    it('should return all versions of that journal', function (done) {
      createJournalWithTwoVersions(placeNewDoc, function (journalId, firstVersion, secondVersion) {
        get(`${endpoint}/${journalId}/versions`)
        .then(function (versionsResponse) {
          versionsResponse.features.length.should.equal(2)
          done()
        })
      })
    })
    it('should raise an error on non existing UUID', function (done) {
      get(`${endpoint}/76100b453de20da6744eac86700294b8/versions`)
      .then(_.Log('error response'))
      .then(function (errorResponse) {
        errorResponse.status.should.equal('no object with this id in db')
        done()
      })
    })
  })
  describe('GET id/version/versionId', function () {
    it('should return the version of id identifier by versionId', function (done) {
      createJournalWithTwoVersions(placeNewDoc, function (journalId, firstVersion, secondVersion) {
        get(`${endpoint}/${journalId}/version/${firstVersion._versionId}`)
        .then(function (versionGetResponse) {
          firstVersion._versionId.should.equal(versionGetResponse._versionId)
          JSON.stringify(firstVersion).should.equal(JSON.stringify(versionGetResponse))
          done()
        })
      })
    })
    it('should not retreive the most recent version', function (done) {
      createJournalWithTwoVersions(placeNewDoc, function (journalId, firstVersion, secondVersion) {
        get(`${endpoint}/${journalId}`)
        .then(function (latestVersionResponse) {
          get(`${endpoint}/${journalId}/version/${firstVersion._versionId}`)
          .then(function (getVersionResponse) {
            latestVersionResponse.properties.name
              .should.equal(secondVersion.properties.name)
            getVersionResponse.properties.name
              .should.equal(firstVersion.properties.name)
            done()
          })
        })
      })
    })
    it('should return 400 for an invlaid id', function (done) {
      breq.get(`${endpoint}/someInvalidId/version/someInvalidVersionId`)
      .then(function (res) {
        res.statusCode.should.equal(400)
        res.body.status.should.equal('invalid id')
        done()
      })
    })
    it('should return 400 for an invalid version id', function (done) {
      breq.get(`${endpoint}/76100b453de20da6744eac86700294b8/version/someInvalidVersionId`)
      .then(function (res) {
        res.statusCode.should.equal(400)
        res.body.status.should.equal('invalid version id')
        done()
      })
    })
    it('should return 404 for an unknown id', function (done) {
      createJournalWithTwoVersions(placeNewDoc, function (journalId, firstVersion, secondVersion) {
        breq.get(`${endpoint}/76100b453de20da6744eac86700294b8/version/${firstVersion._versionId}`)
        .then(function (res) {
          res.statusCode.should.equal(404)
          res.body.status.should.equal('no object with this id in db')
          done()
        })
      })
    })
    it('should return 404 for an unknown versionId', function (done) {
      createJournalWithTwoVersions(placeNewDoc, function (journalId, firstVersion, secondVersion) {
        breq.get(`${endpoint}/${journalId}/version/76100b453de20da6744eac86700294b8`)
        .then(function (res) {
          res.statusCode.should.equal(404)
          res.body.status.should.equal('no object with this id in db')
          done()
        })
      })
    })
  })
  describe('UPDATE id', function () {
    it('should accept a correct object for update', function (done) {
      post(endpoint, placeNewDoc)
      .then(function (body1) {
        placeNewDoc.properties.name += ' - Version 2'
        put(`${endpoint}/${body1.id}`, placeNewDoc)
        .then(function (retVal) {
          retVal.ok.should.equal(true)
          done()
        })
      })
    })
    it('should return a 400 on invalid doc', function (done) {
      const invalidNewDoc = {
        this: 'is',
        no: 'geojson'
      }
      post(endpoint, placeNewDoc)
      .then(function (body1) {
        breq.put(`${endpoint}/${body1.id}`, invalidNewDoc)
        .then(function (res) {
          res.statusCode.should.equal(400)
          done()
        })
      })
    })
    it('should return the new version after update', function (done) {
      post(endpoint, placeNewDoc)
      .then(function (body1) {
        placeNewDoc.properties.name += ' - Version 2'
        put(`${endpoint}/${body1.id}`, placeNewDoc)
//        .then(_.Log('retval of update command'))
        .then(function (body2) {
          get(`${endpoint}/${body2.id}`)
//          .then(_.Log('retval of get command'))
          .then(function (body3) {
//            console.log(body3)
            body3.should.be.an.Object()
            body3.properties.should.be.an.Object()
            _.isUuid(body3._id).should.equal(true)
            body3._id.should.equal(body2.id)
            // copying the id to make comparison simpler
            placeNewDoc._id = body3._id
            // deleting the versionId to make comparison simpler
            delete body3._versionId
            const b = JSON.stringify(placeNewDoc)
            const a = JSON.stringify(body3)
            a.should.equal(b)
            done()
          })
        })
      })
    })
  })
  describe('DELETE id', function () {
    it('should add the deleted flag to supplied UUID', function (done) {
      post(endpoint, placeNewDoc)
      .then(function (body1) {
        delete_(`${endpoint}/${body1.id}`)
        .then(function (deleteAnswer) {
          deleteAnswer.ok.should.equal(true)
          get(`${endpoint}/${deleteAnswer.id}`)
          .then(function (body2) {
            body2._deleted.should.equal(true)
            done()
          })
        })
      })
    })
    it('should return 208 if the UUID is already deleted', function (done) {
      post(endpoint, placeNewDoc)
      .then(function (body1) {
        delete_(`${endpoint}/${body1.id}`)
        .then(function (deleteAnswer1) {
          breq.delete(`${endpoint}/${deleteAnswer1.id}`)
          .then(function (deleteAnswer2) {
            deleteAnswer2.statusCode.should.equal(208) // "already reported", borrowed from WebDAV
            done()
          })
        })
      })
    })
    it('should return 404 if the UUID is not there', function (done) {
      breq.delete(`${endpoint}/3f99cbbccb02d48b595c369a00000000`)
      .then(function (deleteAnswer) {
        deleteAnswer.statusCode.should.equal(404)
        done()
      })
    })
  })
})
