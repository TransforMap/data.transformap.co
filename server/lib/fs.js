const bluebird = require('bluebird')
const fs = bluebird.promisifyAll(require('fs'))

module.exports = {
  readFile: function (path) {
    return fs.readFileAsync(path, {encoding: 'utf-8'})
  },
  writeFile: fs.writeFileAsync.bind(fs)
}
