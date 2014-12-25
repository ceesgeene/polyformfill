'use strict';

var testInput = document.createElement('input');

/** @const */
var INPUT_ATTR_TYPE = 'type';

if (!('valueAsDate' in testInput)) {
  initInputDate();
  if (typeof initDom !== 'undefined') {
    initDom();
  }
  //
  initAccessibility();
  initLocalization();
  if (typeof initNormalization !== 'undefined') {
    initNormalization();
  }
}
