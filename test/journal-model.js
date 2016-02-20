const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
require('should')

const it = global.it // for lint
const describe = global.describe // for lint

const Journal = __.require('controllers', 'things/models/commons/journal')
const someJournalId = 'caa653ce22d3213f54338dd45300041c'

const validVersionDoc = function (journalId) {
  return {
    _id: 'abf653ce22d3213f54338dd45300041c',
    context: 'version',
    type: 'place',
    journal: journalId,
    data: {
      geometry: {
        type: 'Point',
        coordinates: [
          15.144269,
          47.050959
        ]
      },
      properties: {
        name: 'Transition House'
      }
    }
  }
}

describe('journal model', function () {
  describe('create', function () {
    const createFn = () => Journal.create('place')

    it('should be a function', function (done) {
      Journal.create.should.be.a.Function()
      done()
    })
    it('should return an object', function (done) {
      createFn.should.not.throw()
      createFn().should.be.an.Object()
      done()
    })
    it('should have context set to journal', function (done) {
      createFn().context.should.equal('journal')
      done()
    })
    it('should return an object with an array of versions', function (done) {
      createFn().versions.should.be.an.Array()
      done()
    })
    it('should return an object with the passed type', function (done) {
      createFn().type.should.equal('place')
      done()
    })
  })

  describe('update', function () {
    it('should be a function', function (done) {
      Journal.update.should.be.a.Function()
      done()
    })
    it('should return an object', function (done) {
      const journalDoc = {
        _id: someJournalId,
        versions: []
      }
      const versionDoc = validVersionDoc(someJournalId)
      Journal.update(journalDoc, versionDoc).should.not.throw()
      Journal.update(journalDoc, versionDoc).should.be.an.Object()
      done()
    })
    it('should return an object with one more ref', function (done) {
      const journalDoc = {
        _id: someJournalId,
        versions: []
      }
      const versionDoc = validVersionDoc(someJournalId)
      const updatedMetaDoc = Journal.update(journalDoc, versionDoc)
      updatedMetaDoc.versions.length.should.equal(1)
      done()
    })
    it('should return an object with versions ids only', function (done) {
      const journalDoc = {
        _id: someJournalId,
        versions: []
      }
      const versionDoc = validVersionDoc(someJournalId)
      const updatedMetaDoc = Journal.update(journalDoc, versionDoc)
      _.isUuid(updatedMetaDoc.versions[0]).should.equal(true)
      done()
    })
    it('should return an object with current data set to the versionDoc', function (done) {
      const journalDoc = {
        _id: someJournalId,
        versions: []
      }
      const versionDoc = validVersionDoc(someJournalId)
      const updatedMetaDoc = Journal.update(journalDoc, versionDoc)
      const a = JSON.stringify(updatedMetaDoc.data)
      const b = JSON.stringify(versionDoc.data)
      a.should.equal(b)
      done()
    })
  })
})
