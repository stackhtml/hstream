# hstream

streaming html templates

like [hyperstream](https://github.com/substack/hyperstream), but faster. it does not support all hyperstream features.

currently unsupported:

 - inserting text; only html is supported
 - prepending or appending to attributes

[![npm][npm-image]][npm-url]
[![actions][actions-image]][actions-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/hstream.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/hstream
[actions-image]: https://github.com/stackhtml/hstream/workflows/CI/badge.svg
[actions-url]: https://github.com/stackhtml/hstream/actions?query=workflow%3ACI
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install hstream
```

## Usage

```js
var hstream = require('hstream')

hstream({
  'div > .x[attr="value"]': fs.createReadStream('./xyz.html')
})
```

## API

### `hstream(updates)`

Create a through stream that applies `updates`. `updates` is an object with CSS
selectors for keys. Values can be different types depending on what sort of
update you want to do.

Selectors support the most common CSS features, like matching tag names,
classes, IDs, attributes. Pseudo selectors are not supported, but PRs are
welcome.

Pass a stream or string to replace the matching element's contents with some
HTML. Pass an object to set attributes on the matching element or do some
special operations. When passing an object, you can use keys prefixed with `_`
for the following special operations:

 - `_html` - Replace the matching element's contents with some HTML
 - `_prependHtml` - Prepend some HTML to the matching element
 - `_appendHtml` - Append some HTML to the matching element
 - `_replaceHtml` - Replace the entire element with some HTML

All properties accept streams and strings.

`_html` and `_replaceHtml` can also be a function. Then they are called with
the html contents of the element being replaced, and should return a stream or
a string.

When setting attributes, you can also use a function that receives the value of
the attribute as the only parameter and that returns a stream or string with
the new contents.

```js
hstream({
  '#a': someReadableStream(), // replace content with a stream
  '#b': 'a string value', // replace content with a string
  // prepend and append some html
  '#c': { _prependHtml: 'here comes the <b>content</b>: ', _appendHtml: ' …that\'s all folks!' },
  // replace content with a stream and set an attribute `attr="value"`
  '#d': { _html: someReadableStream(), 'attr': 'value' },
  // set an attribute `data-whatever` to a streamed value
  '#e': { 'data-whatever': someReadableStream() },
  // replace an element with something that depends on the current value
  '#f': { _html: function (input) { return input.toUpperCase() } },
  // replace an attribute with something that depends on its current value
  '#g': { class: function (current) { return cx(current, 'other-class') } }
})
```

## Benchmarks

Run `npm run bench`.

hstream:

```
NANOBENCH version 2
> /usr/bin/node bench/hstream.js

# 10× single transform
ok ~233 ms (0 s + 232898600 ns)

# many transforms
ok ~159 ms (0 s + 158674007 ns)

# small file
ok ~11 ms (0 s + 11377188 ns)

all benchmarks completed
ok ~403 ms (0 s + 402949795 ns)
```

hyperstream:

```
NANOBENCH version 2
> /usr/bin/node bench/hyperstream.js

# 10× single transform
ok ~1.84 s (1 s + 841403862 ns)

# many transforms
ok ~1.69 s (1 s + 694201406 ns)

# small file
ok ~101 ms (0 s + 101124108 ns)

all benchmarks completed
ok ~3.64 s (3 s + 636729376 ns)
```

## License

[Apache-2.0](LICENSE.md)
