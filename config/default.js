module.exports = {
  universalPath: require('./universal_path'),
  server: {
    host: '0.0.0.0',
    port: 8726
  },
  db: {
    protocol: 'http',
    host: 'localhost',
    port: 5984,
    username: 'your username',
    password: 'your password'
  }
}
