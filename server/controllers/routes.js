const poi = require('./poi/poi')

module.exports = {
  'hello': {
    get: function (req, res, next) {
      var name = req.query.name || 'you'
      res.json({ hello: name })
    }
  },
  'poi': {
    post: poi.post
  },
  'poi/:id': {
    get: poi.get
  }
}
