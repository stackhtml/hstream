var test = require('tape')
var through = require('through2')
var concat = require('simple-concat')
var hyperstream = require('../')

test('multiple streams in order', function (t) {
  var hs = hyperstream({
    '#a': makeStream(),
    '#b': makeStream(),
    '#c': 'whatever',
    '#d': makeStream()
  })
  concat(hs, function (err, result) {
    t.ifError(err)
    t.equal(result.toString(), `
      <body>
        <a id="a">abcdefghijklmnopqrstuvwxyz</a>
        <p id="c">whatever</p>
        <b id="b">abcdefghijklmnopqrstuvwxyz</b>
        <div id="d">abcdefghijklmnopqrstuvwxyz</div>
      </body>
    `.replace(/\s{2,}/g, ''))
    t.end()
  })
  hs.end('<body><a id="a"></a><p id="c"></p><b id="b"></b><div id="d"></div></body>')
})

function makeStream () {
  var s = through()
  var list = 'abcdefghijklmnopqrstuvwxyz'.split('')
  next()
  return s
  function next () {
    var i = list.shift()
    if (i) {
      s.push(i)
      setTimeout(next, 20)
    } else s.end()
  }
}
