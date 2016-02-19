const poi = require('./poi/poi')

module.exports = {
  'hello': {
    get: function (req, res, next) {
      var name = req.query.name || 'you'
      res.json({ hello: name })
    }
  },
  'poi': {
    post: poi.create
  },
  'poi/:id': {
    get: poi.read,
    put: poi.update
  },
  'event': {
    post: (a) => null // TODO: event.create - create event
  },
  'event/:id': {
    get: (a) => null, // TODO read single event
    post: (a) => null // TODO update event
  }
}
