Polyformfill [![Build Status](https://api.travis-ci.org/ceesgeene/polyformfill.svg?branch=develop)](https://travis-ci.org/ceesgeene/polyformfill)
==============

Polyfill script for HTML5 form elements.

Currently supported:

 * input[type=date]

Install
-------

You can install this package either with `npm` or with `bower`.

### npm

```shell
npm install polyformfill
```

### bower

```shell
bower install polyformfill
```

Usage
-----

Simply add a `<script>` to your HTML document (position doesn't really matter but at least before scripts that
rely on any of the DOM interface polyfills), e.g. if you are using bower:

```html
<script src="/bower_components/polyformfill/polyformfill.js"></script>
```

Browser compatibility [![Sauce Test Status](https://saucelabs.com/buildstatus/polyformfill)](https://saucelabs.com/u/polyformfill)
-----------------------

[![Sauce Test Status](https://saucelabs.com/browser-matrix/polyformfill.svg)](https://saucelabs.com/u/polyformfill)
