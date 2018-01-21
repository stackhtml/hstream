var Writable = require('stream').Writable
var bench = require('nanobench')
var fs = require('fs')
var path = require('path')

var npmjs = path.join(__dirname, 'npmjs.html')

bench('hyperstream single', function (b) {
  var hyperstream = require('hyperstream')
  var left = 10

  b.start()
  next()

  function next () {
    if (left-- === 0) return b.end()
    fs.createReadStream(npmjs)
      .pipe(hyperstream({ '#npm-expansion': 'benchmark' }))
      .pipe(sink(next))
  }
})

bench('hyperstream2 single', function (b) {
  var hyperstream = require('../')
  var left = 10

  b.start()
  next()

  function next () {
    if (left-- === 0) return b.end()
    fs.createReadStream(npmjs)
      .pipe(hyperstream({ '#npm-expansion': 'benchmark' }))
      .pipe(sink(next))
  }
})

function sink (cb) {
  return new Writable({
    write: function (chunk, enc, next) { next() },
    final: function (done) { done(); cb() }
  })
}
