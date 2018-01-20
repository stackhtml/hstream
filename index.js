var HTMLParser = require('htmlparser2').Parser
var through = require('through2')
var eos = require('end-of-stream')
var parseSelector = require('./selector')

module.exports = function hyperstream2 (updates) {
  var parser = new HTMLParser({
    onopentag: onopentag,
    ontext: ontext,
    onclosetag: onclosetag,
    onend: onparseend,
    onerror: onerror
  }, { lowerCaseTags: true, decodeEntities: true })

  var matchers = buildMatchers(updates)

  // original html source, so we can slice from it
  var source = ''

  // parsed element stack
  var stack = []

  // output chunks that were not yet written
  var queued = []
  // whether we are currently busy piping a stream into the output
  // →  newly queued chunks should wait for that stream to finish
  var piping = false
  // true when we are replacing element contents
  // →  we should ignore results from the parser
  var replacing = false

  var stream = through(onchunk, onend)
  return stream

  function push () {
    if (queued.length === 0) return
    var next = queued.shift()
    if (isStream(next)) {
      piping = true
      eos(next, function () {
        piping = false
        push()
      })
      next.on('data', function (chunk) {
        stream.push(chunk)
      })
      next.on('error', onerror)
    } else {
      stream.push(next)
      push()
    }
  }
  function queue (val) {
    if (replacing) return
    // TODO avoid this `.push()` → `.shift()` dance when it is not necessary,
    // eg when we are only pushing lots of strings and never wait for a stream
    queued.push(val)
    if (!piping) push()
  }

  // Get the original source for the thing being parsed right now
  function slice () {
    return source.slice(parser.startIndex, parser.endIndex + 1)
  }

  // Check if the current element stack matches a selector
  // If it does, return the update object for the matching selector
  function matches () {
    return matchers.find(function (o) {
      return o.matches(stack)
    })
  }

  function onchunk (chunk, enc, cb) {
    source += chunk.toString()
    parser.write(chunk.toString())
    cb()
  }

  function onend () {
    parser.end()
  }

  function onopentag (name, attrs) {
    var el = { tagName: name, attrs: attrs }
    stack.push(el)

    var match = matches()
    var tag = slice()
    if (match) {
      // console.error('matched', match, stack)
      if (hasAttrs(match.update)) {
        addAttrs(tag, match.update).forEach(queue)
      } else {
        queue(tag)
      }

      if (match.update._prependHtml) {
        queue(match.update._prependHtml)
      }

      if (match.update._html) {
        queue(match.update._html)
        replacing = true
        el.replaceContents = true
      }

      // store the update object so we can use it in the close tag handler
      el.update = match.update
    } else {
      queue(tag)
    }
  }

  function ontext (text) {
    // just pass text through unchanged
    queue(slice())
  }

  function onclosetag (name) {
    var el = stack.pop()
    if (el.replaceContents) replacing = false // stop replacing
    if (el.update) {
      if (el.update._appendHtml) {
        queue(el.update._appendHtml)
      }
    }
    queue(slice())
  }

  function onparseend () {
    // close the output stream
    queue(null)
  }

  function onerror (error) {
    stream.emit('error', error)
  }
}

function buildMatchers (updates) {
  var selectors = Object.keys(updates)
  var matchers = []
  for (var i = 0; i < selectors.length; i++) {
    var update = updates[selectors[i]]
    if (isStream(update) || typeof update !== 'object') update = { _html: update }
    matchers.push({
      matches: parseSelector(selectors[i]),
      update: update
    })
  }
  return matchers
}

// check if an update object has any attributes
// (properties starting with _ are not attributes)
function hasAttrs (update) {
  var k = Object.keys(update)
  for (var i = 0; i < k.length; i++) {
    if (k[i][0] !== '_') return true
  }
  return false
}
// insert attributes into an html open tag string
//
//    addAttrs('<div a="b">', { c: 'd' })
//    → <div a="b" c="d">
function addAttrs (str, update) {
  var attrs = []

  // split the tag into two parts: `<tagname attrs` and `>` (or `/>` for self closing)
  var x = str.match(/^(.*?)(\/?>)$/)
  attrs.push(x[1])

  var k = Object.keys(update)
  for (var i = 0; i < k.length; i++) {
    if (k[i][0] === '_') continue
    attrs.push(' ' + k[i] + '="', update[k[i]], '"')
  }
  attrs.push(x[2])
  return attrs
}

function isStream (o) { return typeof o === 'object' && o && o.pipe }
