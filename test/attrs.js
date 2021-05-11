var test = require('tape')
var concat = require('simple-concat')
var through = require('through2')
var hyperstream = require('../')

test('add an attribute', function (t) {
  var hs = hyperstream({
    '#a': { class: 'it worked' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a" class="it worked"></div>')
    t.end()
  })
  hs.end('<div id="a"></div>')
})

test('replace an attribute', function (t) {
  var hs = hyperstream({
    '#a': { class: 'it worked' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div class="it worked" id="a"></div>')
    t.end()
  })
  hs.end('<div class="it did not work" id="a"></div>')
})

test('remove attribute', function (t) {
  var hs = hyperstream({
    '#a': { class: null }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a"></div>')
    t.end()
  })
  hs.end('<div class="it did not work" id="a"></div>')
})

test.skip('prepend to attribute', function (t) {
  var hs = hyperstream({
    '#a': { class: { prepend: 'it ' } }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div class="it worked" id="a"></div>')
    t.end()
  })
  hs.end('<div class="worked" id="a"></div>')
})

test.skip('append to attribute', function (t) {
  var hs = hyperstream({
    '#a': { class: { append: ' worked' } }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div class="it worked" id="a"></div>')
    t.end()
  })
  hs.end('<div class="it" id="a"></div>')
})

test('edit attribute', function (t) {
  var hs = hyperstream({
    '#a': {
      class: function (original) {
        return original.toUpperCase()
      }
    }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div class="CLASSNAME" id="a"></div>')
    t.end()
  })
  hs.end('<div class="classname" id="a"></div>')
})

test('edit attribute with streams', function (t) {
  var hs = hyperstream({
    '#a': {
      class: function (initial) {
        var stream = through(function (chunk, enc, cb) {
          cb()
        }, function (cb) {
          cb(null, 'beep boop')
        })
        stream.end(initial)
        return stream
      }
    }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div class="beep boop" id="a"></div>')
    t.end()
  })
  hs.end('<div class="classname" id="a"></div>')
})

test('complex attribute selector', function (t) {
  var hs = hyperstream({
    'div[class^="it"][class$="work"]': { class: 'it worked' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a"><div class="it worked"></div></div>')
    t.end()
  })
  hs.end('<div id="a"><div class="it should work"></div></div>')
})
