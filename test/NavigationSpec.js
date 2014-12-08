
describe('A input[type=date] element', function () {

  /*it('should have its value cleared on BACKSPACE keydown event', function (done) {
    var input = document.createElement('input');
    input.setAttribute('type', 'date');
    input.setAttribute('value', '1970-01-01');

    document.body.appendChild(input);

    expect(input.value).toBe('1970-01-01');

    var evt = document.createEvent('KeyboardEvent');
    if (evt.initKeyboardEvent) {
      evt.initKeyboardEvent("keydown", true, true, window, 'Backspace', 0, 0, true, 'en');
      evt.keyCode = 8;
    }
    else {
      evt = new KeyboardEvent('keydown', { keyCode : 8, bubbles: true });
    }

    window.setTimeout(function() {
      expect(input.value).toBe('');
      done();
    }, 500);

    var canceled = !input.dispatchEvent(evt);
  });*/
});
