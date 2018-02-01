var test = require('tape')
var fs = require('fs')
var path = require('path')
var hstream = require('../')
var dedent = require('dedent')
var concat = require('simple-concat')

test('doctype and comments', function (t) {
  var input = fs.readFileSync(path.join(__dirname, './doctype.html'))
  var transform = hstream({})
  concat(transform, function (err, contents) {
    t.ifError(err)
    t.equal(contents.toString(), input.toString())
    t.end()
  })

  transform.end(input)
})

test('doctype', function (t) {
  var transform = hstream({ title: 'abc' })
  concat(transform, function (err, contents) {
    t.ifError(err)
    t.equal(contents.toString(), dedent`
      <!DOCTYPE html>
      <html>
        <head>
          <title>abc</title>
        </head>
      </html>
    `)
    t.end()
  })
  transform.end(dedent`
    <!DOCTYPE html>
    <html>
      <head>
        <title>def</title>
      </head>
    </html>
  `)
})
