var test = require('tape')
var concat = require('simple-concat')
var hyperstream = require('../')

test('self closing tags', function (t) {
  var pass = hyperstream({})
  var source = '<div><img alt="nothing" src="/img.jpg" /><br /><br><hr><meta charset="utf-8"></div>'
  concat(pass, function (err, result) {
    t.ifError(err)
    t.equal(result.toString(), source)
    t.end()
  })

  pass.end(source)
})
