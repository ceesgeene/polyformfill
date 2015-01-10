"use strict";

/** @const */
var INPUT_ATTR_TYPE = "type",
  INPUT_ATTR_LANG = "lang";

function init() {
  var testInput = document.createElement("input");

  if (!(INPUT_PROPERTY_VALUEASDATE in testInput)) {
    initInput(testInput);

    initInputDate();
    initInputDatetimeLocal();
    initInputTime();
  }
}
