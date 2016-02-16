// inspired by inventaire-client:app/lib/shared/promises.coffee
const bluebird = require('bluebird')

// used has a way to create only one resolved promise to start promise chains
const resolved = Object.freeze(bluebird.resolve())

module.exports = {
  resolve: bluebird.resolve.bind(bluebird),
  reject: bluebird.reject.bind(bluebird),
  resolved: resolved,
  // used to start a promise chain
  // allowing the first functions of the chain
  // to return a promise or not and still be able
  // to follow it by .then and .catch
  start: resolved,
  all: bluebird.all.bind(bluebird)
}
