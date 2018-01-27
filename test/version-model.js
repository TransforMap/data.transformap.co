const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
require('should')

const it = global.it // for lint
const describe = global.describe // for lint

const Version = __.require('controllers', 'things/models/commons/version')
const someJournalId = 'caa653ce22d3213f54338dd45300041c'

const createValidVersionDoc = function (journalId) {
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
describe('version model', function () {
  describe('create', function () {
    it('should be a function', function (done) {
      Version.create.should.be.a.Function()
      done()
    })


    it('should throw if the journal id is missing', function (done) {
      var doc = createValidVersionDoc(someJournalId)
      doc.journal = null
      const create = function () { Version.create(doc) }
      create.should.throw()
      try {
        create()
      } catch (err) {
//        console.log(err)
        err.message.should.equal('missing journal id')
      }
      done()
    })
  })
  describe('parseCurrentVersion', function () {
    it('should be a function', function (done) {
      Version.parseCurrentVersion.should.be.a.Function()
      done()
    })
    it('should return only the data object of the versionDoc', function (done) {
      var versionDoc = createValidVersionDoc(someJournalId)
      const testdata = { test: 'data' }
      versionDoc.data = testdata
      const datastring = JSON.stringify(testdata)
      var retVal = Version.parseCurrentVersion(versionDoc)
      delete retVal._id // added by parseCurrentVersion on default
      delete retVal._versionId // added by parseCurrentVersion on default
      const retValDataString = JSON.stringify(retVal)
      retValDataString.should.equal(datastring)
      done()
    })
    it('should add the _id - attribute according to the journal id of versionDoc', function (done) {
      const versionDoc = createValidVersionDoc(someJournalId)
      const retVal = Version.parseCurrentVersion(versionDoc)
      retVal._id.should.equal(someJournalId)
      done()
    })
    it('should add the versionId - atrribute according to the id of the versionDoc', function (done) {
      const versionDoc = createValidVersionDoc(someJournalId)
      const retVal = Version.parseCurrentVersion(versionDoc)
      retVal._versionId.should.equal(versionDoc._id)
      done()
    })
    it('should add the _deleted - flag if the deleted-status is set in the versionDoc', function (done) {
      var versionDoc = createValidVersionDoc(someJournalId)
      const status = { deleted: true, status2: 'blubb' }
      versionDoc.status = status
      const retVal = Version.parseCurrentVersion(versionDoc)
      retVal._deleted.should.equal(true)
      done()
    })
  })
})
