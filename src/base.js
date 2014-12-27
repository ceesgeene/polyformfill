'use strict';

var testInput = document.createElement('input');

/** @const */
var INPUT_ATTR_TYPE = 'type';

if (!('valueAsDate' in testInput)) {
  initInput();

  initInputDate();

  //
  initAccessibility();
  initLocalization();
  if (typeof initNormalization !== 'undefined') {
    initNormalization();
  }
  initInputTime();
}
