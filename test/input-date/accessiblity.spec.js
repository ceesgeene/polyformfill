'use strict';

describe('An accessible input[type=date] element', function () {

  /*it('should have its value cleared on BACKSPACE keydown event', function () {
    var input = document.createElement('input');
    input.setAttribute('type', 'date');
    input.setAttribute('value', '1970-01-01');

    document.body.appendChild(input);

    expect(input.value).toBe('1970-01-01');

    input.dispatchEvent(window.crossBrowser_initKeyboardEvent("keydown", {"key": 'Backspace', 'bubbles': true}));

    expect(input.value).toBe('');
  });*/

  /*it('can be navigated using the arrow LEFT and arrow RIGHT keys', function () {
      var input = document.createElement('input');
      input.setAttribute('type', 'date');
      input.setAttribute('value', '1970-01-01');

      document.body.appendChild(input);

      expect(input.value).toBe('1970-01-01');

      input.focus();
      input.dispatchEvent(window.crossBrowser_initKeyboardEvent("keydown", { "key": 'Right', 'bubbles': true }));
      input.dispatchEvent(window.crossBrowser_initKeyboardEvent("keydown", { "key": 'Up', 'bubbles': true }));

      expect(input.value).toBe('1970-02-01');
  });*/

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


});

