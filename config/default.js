module.exports = {
  universalPath: require('./universal_path'),
  server: {
    protocol: 'http',
    host: '0.0.0.0',
    port: 8726,
    url: function () {
      return `${this.protocol}://${this.host}:${this.port}`
    }
  },
  db: {
    protocol: 'http',
    host: 'localhost',
    port: 5984,
    username: 'your username',
    password: 'your password'
  }
}
