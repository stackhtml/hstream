var Writable = require('stream').Writable
var bench = require('nanobench')
var fs = require('fs')
var path = require('path')

var npmjs = path.join(__dirname, 'npmjs.html')
var cnn = path.join(__dirname, 'cnnlite.html')

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

bench('hyperstream many', function (b) {
  var hyperstream = require('hyperstream')
  var left = 10

  b.start()
  var stream = fs.createReadStream(npmjs)
  while (left-- > 0) {
    stream = stream.pipe(hyperstream({ '#npm-expansion': 'benchmark: ' + left + ' left' }))
  }
  stream.pipe(sink(b.end))
})

bench('hyperstream2 many', function (b) {
  var hyperstream = require('../')
  var left = 10

  b.start()
  var stream = fs.createReadStream(npmjs)
  while (left-- > 0) {
    stream = stream.pipe(hyperstream({ '#npm-expansion': 'benchmark: ' + left + ' left' }))
  }
  stream.pipe(sink(b.end))
})

bench('hyperstream small file', function (b) {
  var hyperstream = require('hyperstream')
  var left = 10

  b.start()
  next()

  function next () {
    if (left-- === 0) return b.end()
    fs.createReadStream(cnn)
      .pipe(hyperstream({ '[data-react-helmet]': 'benchmark' }))
      .pipe(sink(next))
  }
})

bench('hyperstream2 small file', function (b) {
  var hyperstream = require('../')
  var left = 10

  b.start()
  next()

  function next () {
    if (left-- === 0) return b.end()
    fs.createReadStream(cnn)
      .pipe(hyperstream({ '[data-react-helmet]': 'benchmark' }))
      .pipe(sink(next))
  }
})

function sink (cb) {
  return new Writable({
    write: function (chunk, enc, next) { next() },
    final: function (done) { done(); cb() }
  })
}
