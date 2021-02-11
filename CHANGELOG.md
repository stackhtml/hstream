# hstream change log

All notable changes to this project will be documented in this file.

This project adheres to [Semantic Versioning](http://semver.org/).

## 3.0.0

 * Update dependencies. This major version bump is out of caution in case the parsing for the underlying HTML or CSS selector libraries changed.

## 2.0.0

 * Update dependencies. hstream now requires Node.js 8 or up.

## 1.2.0

 * Add ability to append or prepend to attributes (https://github.com/stackhtml/hstream/commit/e9b71c39d5a08d27b2ee09ae3043abcecd57b3db)

   ```js
   hstream({
     '#app': {
       class: { prepend: 'beep ', append: ' boop' }
     }
   })
   ```

 * Remove attributes by setting `attrName: null` (https://github.com/stackhtml/hstream/commit/32480ba33327b1f32b16a91dc6752b4ecb5b8cec)
 * Edit attributes by passing a function (https://github.com/stackhtml/hstream/commit/32480ba33327b1f32b16a91dc6752b4ecb5b8cec)

   ```js
   hstream({
     '#app': {
       title: function (prev) { return prev.toUpperCase() }
     }
   })
   ```

 * Edit html contents by passing a function (https://github.com/stackhtml/hstream/commit/b562c5ff1a644893093dda1c99558dded71fb422)

   ```js
   hstream({
     'code': {
       _html: function (source) {
         return highlightHTML(source)
       }
     }
   })
   ```

## 1.1.0

 * Add `_replaceHtml` option that replaces the outer html of an element

## 1.0.1

 * Pass through DOCTYPE and HTML comments untouched.

## 1.0.0

 * Initial release.
