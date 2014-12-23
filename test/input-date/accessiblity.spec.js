'use strict';

/* global describe, expect, it */

describe('An accessible input[type=date] element', function () {

  describe('can be navigated using the arrow keys', function () {
    var w;

    it('test 1', function(done) {

      window.hello = function() {

        var input = w.document.createElement('input');
        input.setAttribute('type', 'date');
        input.setAttribute('value', '1970-01-01');

        w.document.body.appendChild(input);

        input.focus();
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Right', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Up', 'bubbles': true}));

        expect(input.value).toBe('1970-02-01');

        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Right', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Left', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Up', 'bubbles': true}));

        expect(input.value).toBe('1970-03-01');

        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Down', 'bubbles': true}));

        expect(input.value).toBe('1970-02-01');

        setTimeout(function() {
          w.close();
          done();
        }, 100);
      };

      w = window.open('base/test/popup.html', 'test');
    });

    it('test 2', function(done) {

      window.hello = function(){

        var input = w.document.createElement('input');
        input.setAttribute('type', 'date');
        input.setAttribute('value', '1970-01-01');

        w.document.body.appendChild(input);

        input.focus();
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Right', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Right', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Left', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Up', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Up', 'bubbles': true}));

        expect(input.value).toBe('1970-03-01');

        setTimeout(function() {
          w.close();
          done();
        }, 100);
      };

      w = window.open('base/test/popup.html', 'test');
    });
  });


  describe('can be navigated using Tab and Shift+Tab keydown', function () {
    var w;

    it('test 1', function (done) {

      window.hello = function () {

        var inputBefore = w.document.createElement('input');
        inputBefore.setAttribute('type', 'text');

        var input = w.document.createElement('input');
        input.setAttribute('type', 'date');
        input.setAttribute('value', '1007-06-15');

        w.document.body.appendChild(inputBefore);
        w.document.body.appendChild(input);

        inputBefore.focus();
        inputBefore.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'U+0009', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'U+0009', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Up', 'bubbles': true}));

        expect(input.value).toBe('1007-07-15');

        setTimeout(function () {
          w.close();
          done();
        }, 100);
      };

      w = window.open('base/test/popup.html', 'test');
    });
  });

  describe('allows its date components to be cleared on Backspace or Del keydown', function () {
    var w;

    it('test 1', function (done) {

      window.hello = function () {

        var input = w.document.createElement('input');
        input.setAttribute('type', 'date');
        input.setAttribute('value', '1007-06-15');

        w.document.body.appendChild(input);

        input.focus();
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Right', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'U+0008', 'bubbles': true}));

        expect(input.value).toBe('');

        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Up', 'bubbles': true}));

        expect(input.value).toBe('1007-01-15');

        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Right', 'bubbles': true}));
        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'U+0008', 'bubbles': true}));

        expect(input.value).toBe('');

        input.dispatchEvent(w.crossBrowser_initKeyboardEvent("keydown", {"key": 'Up', 'bubbles': true}));

        expect(input.value).toBe('1007-01-01');

        setTimeout(function () {
          w.close();
          done();
        }, 100);
      };

      w = window.open('base/test/popup.html', 'test');
    });
  });

});
