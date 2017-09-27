module.exports = {
  env: 'development',
  universalPath: require('./universal_path'),
  server: {
    name: 'transformap',
    scheme: 'http',
    host: '127.0.0.1',
    port: 5000,
    url: function () {
      return `${this.scheme}://${this.host}:${this.port}`
    }
  },
  store: {
    scheme: 'http',
    host: '127.0.0.1',
    port: 5984,
    username: 'transformap',
    password: '',
    // May be a code smell due to @maxlath, also above, as ENV config changes could overwrite
    url: function () {
      return `${this.scheme}://${this.username}:${this.password}@${this.host}:${this.port}`
    }
  }
}
