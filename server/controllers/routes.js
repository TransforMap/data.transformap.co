module.exports = {
  hello: {
    get: function (req, res, next) {
      var name = req.query.name || 'you'
      res.json({ hello: name })
    }
  }
}
