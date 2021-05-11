var csswhat = require('css-what').parse

module.exports = createMatcher

function createMatcher (sel) {
  var selectors = csswhat(sel)
  return function (stack) {
    return selectors.some(function (parts) {
      return match(stack, parts)
    })
  }
}

// check if a parsed selector `parts` matches the element ancestor list `stack`.
// `stack` elements are objects with at least a `.tagName`, and an object `.attrs`
function match (stack, parts) {
  var si = stack.length - 1
  for (var i = parts.length - 1; i >= 0; i--) {
    if (!test()) return false
  }
  return true

  function test () {
    var part = parts[i]
    var el = stack[si]
    if (part.type === 'universal') {
      return true
    } if (part.type === 'attribute') {
      return checkAttr(el, part)
    } else if (part.type === 'tag') {
      return checkTag(el, part)
    } else if (part.type === 'child') {
      si--
      return true
    } else if (part.type === 'descendant') {
      // Move to the parent selector,
      i--
      // and keep walking up the DOM tree to check if it matches
      si--
      while (si >= 0) {
        if (test()) return true
        si--
      }
      return false
    } else {
      throw new Error('unknown selector: ' + JSON.stringify(part))
    }
  }
}

function checkAttr (el, part) {
  if (part.action === 'exists') {
    return part.name in el.attrs
  }

  var attr = el.attrs[part.name]
  if (!attr) {
    return false
  } else if (part.action === 'start') {
    attr = attr.slice(0, part.value.length)
  } else if (part.action === 'end') {
    attr = attr.slice(-part.value.length)
  }

  return part.ignoreCase ? attr.toLowerCase() === part.value.toLowerCase() : attr === part.value
}

function checkTag (el, part) {
  return el.tagName === part.name
}
