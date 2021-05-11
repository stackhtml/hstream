var test = require('tape')
var concat = require('simple-concat')
var hyperstream = require('../')

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

test('attributes w/ newlines', function (t) {
  var hs = hyperstream({
    '#a': { class: 'it worked' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div class="it worked" id="a"></div>')
    t.end()
  })
  hs.end(`<div class="it
    should work"
    id="a"></div>`)
})

test('match multiple classes', function (t) {
  var hs = hyperstream({
    '.first.second': { class: 'first second third' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div class="first second third"></div>')
    t.end()
  })
  hs.end('<div class="first second"></div>')
})

test('match single class against several', function (t) {
  var hs = hyperstream({
    '.second': { class: 'first second third' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div class="first second third"></div>')
    t.end()
  })
  hs.end('<div class="first second"></div>')
})

test('match mixed attributes', function (t) {
  var hs = hyperstream({
    'div#a.b[c="d"]': { _prependHtml: 'matched' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a" class="b" c="d">matched</div>')
    t.end()
  })
  hs.end('<div id="a" class="b" c="d"></div>')
})
