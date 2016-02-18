const dbC = require('config').db
const fullUrl = `${dbC.protocol}://${dbC.username}:${dbC.password}@${dbC.host}:${dbC.port}`
module.exports = require('nano-blue')(fullUrl)
