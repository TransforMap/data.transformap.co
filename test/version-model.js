const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
require('should')

const it = global.it // for lint
const describe = global.describe // for lint

const Version = __.require('controllers', 'things/models/commons/version')
const someJournalId = 'caa653ce22d3213f54338dd45300041c'

describe('version model', function () {
  describe('create', function () {
    it('should be a function', function (done) {
      Version.create.should.be.a.Function()
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
      doc.journal = null
      const create = function () { Version.create(doc) }
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
