'use strict';

/** @const */
var INPUT_ATTR_TYPE = 'type';

function init() {
  var testInput = document.createElement('input');

  if (!('valueAsDate' in testInput)) {
    initInput(testInput);

    initInputDate();
    initInputDatetimeLocal();
    initInputTime();
  }
}

init();
