"use strict";

/**
 * @file
 * Dom interface polyfill code for input elements of type time.
 */

/** @const */
var INPUT_TIME_STEP_DEFAULT = 60;

/** @const */
var INPUT_TIME_STEP_SCALE_FACTOR = 1000;

/**
 *
 * @param element
 * @returns String
 */
function inputTimeDomValueGet(element) {
  return inputTimeGetRfc3339(element);
}

function inputTimeDomValueSet(element, value) {
  var components;

  if ("" !== value) {
    components = inputTimeValidTimeStringToComponents(value);
  }

  if (components) {
    inputTimeComponentsSet(element, components);
  }
  else {
    inputTimeComponentsSet(element, {
      hh: INPUT_TIME_COMPONENT_EMPTY,
      ii: INPUT_TIME_COMPONENT_EMPTY,
      ss: INPUT_TIME_COMPONENT_EMPTY,
      ms: INPUT_TIME_COMPONENT_EMPTY
    });
  }

  return value;
}

function inputTimeDomValueAsDateGet(element) {
  var components = inputTimeComponentsGet(element), date = null;

  if (components.hh !== INPUT_TIME_COMPONENT_EMPTY && components.ii !== INPUT_TIME_COMPONENT_EMPTY) {
    date = new Date(0);
    date.setUTCHours(components.hh);
    date.setUTCMinutes(components.ii);
    if (components.ss > INPUT_TIME_COMPONENT_EMPTY) {
      date.setUTCSeconds(components.ss);
    }
    if (components.ms > INPUT_TIME_COMPONENT_EMPTY) {
      date.setUTCMilliseconds(components.ms);
    }
  }

  return date;
}

function inputTimeDomValueAsDateSet(element, value) {
  inputTimeComponentsSet(element, {
    hh: value.getUTCHours(),
    ii: value.getUTCMinutes(),
    ss: value.getUTCSeconds(),
    ms: value.getUTCMilliseconds()
  });
}
