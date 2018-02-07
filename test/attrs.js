var test = require('tape')
var concat = require('simple-concat')
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

test('prepend to attribute', function (t) {
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

test('append to attribute', function (t) {
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
