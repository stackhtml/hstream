var HTMLParser = require('htmlparser2').Parser
var through = require('through2')
var parseSelector = require('./selector')

module.exports = function hstream (updates) {
  if (typeof updates !== 'object') throw new TypeError('hstream: updates must be object')

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
  var savedIndex = 0

  // parsed element stack
  var stack = []
  var selfClosingIndex = 0

  // output chunks that were not yet written
  var queued = []
  // whether new output chunks should be queued
  var queueWaiting = false
  // true when we are replacing element contents
  // →  we should ignore results from the parser
  var replacing = false

  var stream = through(onchunk, onend)
  return stream

  function onqueueready () {
    queueWaiting = false
    push()
  }
  function onsourceforward (chunk) { stream.push(chunk) }
  function push () {
    if (queued.length === 0) return
    var next = queued.shift()
    if (isStream(next)) {
      queueWaiting = true
      next.on('end', onqueueready)
      next.on('data', onsourceforward)
      next.on('error', onerror)
      next.resume()
    } else {
      stream.push(next)
      push()
    }
  }
  function queue (val) {
    if (replacing) return
    // tack this on to another queued string if it's there to save some `.push()` calls
    if (typeof val === 'string' && queued.length > 0 && typeof queued[queued.length - 1] === 'string') {
      queued[queued.length - 1] += val
    } else {
      // pause streams; so we don't miss any data events once we are ready
      if (isStream(val)) {
        // `.pause()` is advisory in node streams, so pipe it through `through()` which
        // will always buffer
        val = val.pipe(through())
        val.pause()
      }
      queued.push(val)
      // defer calling `push` until the end of this parse tick;
      // this way a lot more strings can end up concatenated into one
      if (!queueWaiting) {
        queueWaiting = true
        process.nextTick(onqueueready)
      }
    }
  }

  // Get the original source for the thing being parsed right now
  function slice () {
    source = source.slice(parser.startIndex - savedIndex)
    savedIndex = parser.startIndex
    return source.slice(0, parser.endIndex + 1 - savedIndex)
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
    selfClosingIndex = parser.startIndex
    stack.push(el)

    var match = matches()
    var tag = slice()
    if (match) {
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

    if (selfClosingIndex === parser.startIndex) return

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

function isStream (o) { return Boolean(typeof o === 'object' && o && o.pipe) }
