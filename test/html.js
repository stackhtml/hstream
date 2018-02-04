var test = require('tape')
var concat = require('simple-concat')
var hyperstream = require('../')

test('replace contents with a string', function (t) {
  var hs = hyperstream({
    '#a': { _html: 'it worked' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a">it worked</div>')
    t.end()
  })
  hs.end('<div id="a">it did not work</div>')
})

test('replace contents with a bare string', function (t) {
  var hs = hyperstream({
    '#a': 'it worked'
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a">it worked</div>')
    t.end()
  })
  hs.end('<div id="a">it did not work</div>')
})

test('replace contents with a stream', function (t) {
  var hs = hyperstream({
    '#a': { _html: 'it worked' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a">it worked</div>')
    t.end()
  })
  hs.end('<div id="a">it did not work</div>')
})

test('append html', function (t) {
  var hs = hyperstream({
    '#a': { _appendHtml: ' worked' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a">it worked</div>')
    t.end()
  })
  hs.end('<div id="a">it</div>')
})

test('prepend html', function (t) {
  var hs = hyperstream({
    '#a': { _prependHtml: 'it ' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a">it worked</div>')
    t.end()
  })
  hs.end('<div id="a">worked</div>')
})

test('prepend and append html', function (t) {
  var hs = hyperstream({
    '#a': { _prependHtml: 'abc', _appendHtml: 'ghi' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a">abcdefghi</div>')
    t.end()
  })
  hs.end('<div id="a">def</div>')
})

test('replace element', function (t) {
  var hs = hyperstream({
    '#slot': { _replaceHtml: '<div id="xyz">new element</div>' }
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result + '', '<div id="a"><div id="xyz">new element</div></div>')
    t.end()
  })
  hs.end('<div id="a"><x id="slot">template slot</x></div>')
})
