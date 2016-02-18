module.exports = {
  universalPath: require('./universal_path'),
  server: {
    protocol: 'http',
    host: '0.0.0.0',
    port: 5000,
    url: function () {
      return `${this.protocol}://${this.host}:${this.port}`
    }
  },
  db: {
    protocol: 'http',
    host: 'geocouch',
    port: 5984,
    username: '',
    password: ''
  }
}
