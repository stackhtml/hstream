# hstream

streaming html templates

like [hyperstream](https://github.com/substack/hyperstream), but faster. it does not support all hyperstream features.

currently unsupported:

 - inserting text; only html is supported
 - prepending or appending to attributes

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/hstream.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/hstream
[travis-image]: https://img.shields.io/travis/stackhtml/hstream.svg?style=flat-square
[travis-url]: https://travis-ci.org/stackhtml/hstream
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install hstream
```

## Usage

```js
var hyperstream = require('hstream')

hyperstream({
  'div > .x[attr="value"]': fs.createReadStream('./xyz.html')
})
```

## API

### `hyperstream(updates)`

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

```js
hstream({
  '#a': someReadableStream(), // replace content with a stream
  '#b': 'a string value', // replace content with a string
  // prepend and append some html
  '#c': { _prependHtml: 'here comes the <b>content</b>: ', _appendHtml: ' …that\'s all folks!' },
  // replace content with a stream and set an attribute `attr="value"`
  '#d': { _html: someReadableStream(), 'attr': 'value' },
  // set an attribute `data-whatever` to a streamed value
  '#e': { 'data-whatever': someReadableStream() }
})
```

## Benchmarks

Run `npm run bench`.

hstream:

```
NANOBENCH version 2
> /usr/bin/node bench/hstream.js

# 10× single transform
ok ~794 ms (0 s + 794449201 ns)

# many transforms
ok ~595 ms (0 s + 594909989 ns)

# small file
ok ~20 ms (0 s + 19878309 ns)

all benchmarks completed
ok ~1.41 s (1 s + 409237499 ns)
```

hyperstream:

```
NANOBENCH version 2
> /usr/bin/node bench/hyperstream.js

# 10× single transform
ok ~4.7 s (4 s + 697728691 ns)

# many transforms
ok ~5.02 s (5 s + 23333119 ns)

# small file
ok ~740 ms (0 s + 739903018 ns)

all benchmarks completed
ok ~10 s (10 s + 460964828 ns)
```

## License

[Apache-2.0](LICENSE.md)
