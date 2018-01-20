# hyperstream2

streaming html templates

like [hyperstream](https://github.com/substack/hyperstream), but faster. it does not support all hyperstream features.

[![npm][npm-image]][npm-url]
[![travis][travis-image]][travis-url]
[![standard][standard-image]][standard-url]

[npm-image]: https://img.shields.io/npm/v/hyperstream2.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/hyperstream2
[travis-image]: https://img.shields.io/travis/goto-bus-stop/hyperstream2.svg?style=flat-square
[travis-url]: https://travis-ci.org/goto-bus-stop/hyperstream2
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
[standard-url]: http://npm.im/standard

## Install

```
npm install hyperstream2
```

## Usage

```js
var hyperstream = require('hyperstream2')

hyperstream({
  'div > .x[attr="value"]': fs.createReadStream('./xyz.html')
})
```

## License

[Apache-2.0](LICENSE.md)
