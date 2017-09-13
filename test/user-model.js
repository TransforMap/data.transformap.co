const CONFIG = require('config')
const __ = CONFIG.universalPath
const _ = __.require('lib', 'utils')
require('should')

const it = global.it // for lint
const describe = global.describe // for lint
const User = __.require('controllers', 'users/lib/users')
const userNewDoc = require('./fixtures/user-new-to-create-for-api')
const data = _.cloneDeep(userNewDoc)

describe('User model', function () {
  describe('validateData', function () {
    it('should be a function', function (done) {
      User.validateData.should.be.a.Function()
      done()
    })
    it('should return an object if the data is valid', function (done) {
      const data = _.cloneDeep(userNewDoc)
      const validateData = function () { return User.validateData(data) }
      validateData.should.not.throw()
      done()
    })
    it('should throw if the email is not correct', function (done) {
      var data = _.cloneDeep(userNewDoc)
      data.contact.email = null
      const validateData = function () { User.validateData(data) }
      validateData.should.throw()
      try {
        validateData()
      } catch (err) {
        console.log(err)
        err.message.should.equal('invalid email type supplied')
      }
      done()
    })
    it('should throw if no name is provided', function (done) {
      var data = _.cloneDeep(userNewDoc)
      data.contact.name = ""
      const validateData = function () { User.validateData(data) }
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
  describe('findOrCreateUser', function () {
    username = userNewDoc.contact.name

    it('should be a function that returns an object', function (done) {
      User.findOrCreateUser.should.be.a.Function()
      User.findOrCreateUser(userNewDoc).should.be.an.Object()
      done()
    })
    it('should return an object with the passed type', function (done) {
      User.findOrCreateUser(userNewDoc)
      .then(function (result) {
        result.type.should.equal("User")
      })
      .then(done, done)
    })
    it('should return a doc._id', function (done) {
      userNewDoc.contact.name = "UnknownName"
      User.findOrCreateUser(userNewDoc)
      .then(function (result) {
        const uuid = result.id || result._id
        _.isUuid(uuid).should.equal(true)
      })
      .then(done, done)
    })
  })
})
