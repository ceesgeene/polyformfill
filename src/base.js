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

function defineAccessorProperty(object, property, getter, setter) {
  var descriptor = {
    configurable: true,
    enumerable: true
  };
  if (getter) {
    descriptor.get = getter;
  }
  if (setter) {
    descriptor.set = setter;
  }
  Object.defineProperty(object, property, descriptor);
}
